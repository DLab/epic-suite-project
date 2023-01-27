from operator import itemgetter
from os import access
from flask import Blueprint, abort, make_response, request, jsonify
import pandas as pd
import app.utils.functions1_2 as fn
from app.utils.verify_request_covid_series import (
    verify_request_covid_series,
    verify_right_properties_in_payload,
    get_attribute_from_dict
)

api_v0 = Blueprint('api_v0', __name__)

seirhvdUSA2 = pd.read_csv(
    "app/endpoint_docs/seirhvd_initCond_by_state.csv", dtype={"FIPS_state": str}
)  # SEIRHVD
statesUSA2 = pd.read_csv(
    "app/endpoint_docs/seir_initCond_by_states.csv", dtype={"FIPS_state": str}
)  # SIR/SEIR states
countiesUSA2 = pd.read_csv(
    "app/endpoint_docs/seir_initCond_by_county.csv", dtype={"FIPS_county": str}
)  # SIR/SEIR counties

@api_v0.route("/data/info", methods=["GET"])
def get_data_info():
    """
    It returns a dictionary with the minimum and maximum dates for each of the three dataframes
    :return: A dictionary with the min and max dates for each dataframe.
    """
    min_max_dates_by_us_dataframe = {
        "seirhvdUSA": {
            "min": sorted(seirhvdUSA2.DateTime.values)[0], # values en un Series object devuelve los valores del atributo
            "max": sorted(seirhvdUSA2.DateTime.values)[-1],
        },
        "statesUSA": {
            "min": sorted(statesUSA2.DateTime.values)[0],
            "max": sorted(statesUSA2.DateTime.values)[-1],
        },
        "countiesUSA": {
            "min": sorted(countiesUSA2.DateTime.values)[0],
            "max": sorted(countiesUSA2.DateTime.values)[-1],
        },
    }
    
    return make_response(jsonify(min_max_dates_by_us_dataframe), 200)


@api_v0.route("/<apiRoute>", methods=["GET", "POST"])
def get_initCond2(apiRoute):
    """
    A function that returns the initial conditions of the model.
    
    :param apiRoute: This is the endpoint you're calling. It can be either initCond or realData
    :return: a response object with the status code 200.
    """
    res, got_covid_series, global_results = None, {}, {}
    type_serie = request.args.get("type") or None
    if apiRoute not in ["initCond", "realData"]:
        abort(404, description="Resource not found")
    if request.method == "POST":
        requested_covid_series = request.get_json(force=True)
        # verification properties
        verify_right_properties_in_payload(
            ["scale", "compartments", "timeInit", "spatialSelection"],
            requested_covid_series,
        )
        series_names = list(requested_covid_series.keys())
        # metapopulation must to have only one series
        if type_serie == "metapopulation" and apiRoute == "realData" and len(requested_covid_series.keys()) > 1:
            abort(400, description="*ERROR. Only 1 metapopulation model for realData")
        # Processing each requested_covid_series
        if type_serie == "metapopulation":
            tmp_requested_covid_series = {}
            fip_list = list(requested_covid_series.values())[0]['spatialSelection']
            if type(fip_list) is not list:
                abort(400, description="*ERROR. Spatial selection must be an array")
            for cod_fip in fip_list:
                tmp_requested_covid_series[cod_fip] = {
                    'name': get_attribute_from_dict(requested_covid_series,'name'),
                    'compartments': get_attribute_from_dict(requested_covid_series,'compartments'),
                    'timeInit': get_attribute_from_dict(requested_covid_series,'timeInit'),
                    'timeEnd': get_attribute_from_dict(requested_covid_series,'timeEnd'),
                    'scale': get_attribute_from_dict(requested_covid_series,'scale'),
                    'spatialSelection': [cod_fip]
                }
            requested_covid_series = tmp_requested_covid_series
            series_names = list(requested_covid_series.keys())

        for index, requested_serie in enumerate(requested_covid_series.values()):
            compartments, timeInit, timeEnd, scale, spatialSelection = itemgetter(
                "compartments", "timeInit", "timeEnd", "scale", "spatialSelection"
            )(requested_serie)
            # validating series attributes
            verify_request_covid_series(
                compartments, timeInit, timeEnd, scale, spatialSelection
            )

            if compartments == "SEIRHVD":
                dataset = seirhvdUSA2
            else:
                if scale == "States":  # statesUSA
                    dataset = statesUSA2
                elif scale == "Counties":  # countiesUSA
                    dataset = countiesUSA2
            try:
                got_covid_series[series_names[index]] = fn.endpointResponse(
                    apiRoute,
                    dataset,
                    compartments,
                    scale,
                    timeInit,
                    timeEnd if apiRoute == "realData" else timeInit,
                    spatialSelection,
                )
                         
               # print(global_results.keys(), flush=True)
            except KeyError as err:
                abort(400, description=f'{err}')
        
        # add global results if realData and metapopulation
        if apiRoute == "realData" and type_serie == "metapopulation":
            global_results = {}
            global_keys = list(list(got_covid_series.values())[0].keys())
            for keys in global_keys:
                if keys != "Compartment":
                    if keys in global_results and len(global_results[keys]) < 1:
                        global_results[keys] = []
                    else:
                        global_results[keys] = []
                    for _i, values_series in enumerate(list(got_covid_series.values())):
                        if len(global_results[keys]) > 0:
                            accum = []
                            for ind, val in zip(global_results[keys], list(map(lambda x: int(x), list(values_series[keys].values())))):
                                accum.append(ind + val)
                                
                            global_results[keys] = accum
                            
                        else:
                            global_results[keys] = list(map(lambda x: int(x), list(values_series[keys].values())))
                    global_results[keys] = {index: value for index, value in enumerate(global_results[keys])}
                    
            global_results["t"] = {index: value for index, value in enumerate(range(0, len(global_results[keys])))}
            got_covid_series["global_results"] = global_results
        

    elif request.method == "GET":
        if apiRoute not in ["initCond", "realData"]:
            abort(404, description="Resource not found")
        got_covid_series["SUCCESS"] = "Endpoint V1.2 WORKING..."

    res = (
        jsonify(
            got_covid_series,
        ),
        200,
    )
    return make_response(res)