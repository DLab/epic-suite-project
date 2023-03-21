from operator import itemgetter
from flask import Flask, abort, make_response, request, jsonify
from datetime import datetime
import pandas as pd
import app.utils.functions1_2 as fn
from app.utils.verify_request_covid_series import (
    verify_request_covid_series,
    verify_right_properties_in_payload,
)
from flask_cors import CORS
from app.v0.api_v0 import api_v0

app = Flask(__name__)
CORS(app)

#api v0
app.register_blueprint(api_v0, url_prefix='/api/v0')

@app.get('/status')
def get_status():
    return make_response(jsonify("ok"),200)

# seirhvdUSA = pd.read_csv(
#     "app/endpoint_docs/seirhvd_initCond_by_state.csv", dtype={"FIPS_state": str}
# )  # SEIRHVD
# statesUSA = pd.read_csv(
#     "app/endpoint_docs/seir_initCond_by_states.csv", dtype={"FIPS_state": str}
# )  # SIR/SEIR states
# countiesUSA = pd.read_csv(
#     "app/endpoint_docs/seir_initCond_by_county.csv", dtype={"FIPS_county": str}
# )  # SIR/SEIR counties


# @app.route("/<apiRoute>", methods=["GET", "POST"])
# def get_initCond(apiRoute):

#     res, new_dict, status_code = None, {}, 0
#     flagTimeInit, flagTimeEnd = False, False

#     if request.method == 'POST':

#         form = request.get_json(force = True) 
#         sim = list(form.keys())[0]
            
#         compartments     = form[sim].get("compartments")
#         timeInit         = form[sim].get("timeInit")
#         timeEnd          = form[sim].get("timeEnd")
#         scale            = form[sim].get("scale")
#         spatialSelection = form[sim].get("spatialSelection")
#         print("sim:", sim)
#         print("Compartment:", compartments)
#         print("timeInit:", timeInit)
#         print("timeEnd:", timeEnd)
#         print("scale:", scale)
#         print("spatialSelection:", spatialSelection)

#         # RESTRICCIONES Y ERRORES
#         if apiRoute not in ["initCond", "realData"]:
#             new_dict[apiRoute] = "ERROR. Incorrect route"

#         # compartment validation
#         if compartments not in ["SIR", "SEIR", "SEIRHVD"]:
#             new_dict[compartments] = "ERROR. Incorrect compartments"

#         # scale validation
#         if scale not in ["States", "Counties"]:
#             new_dict[scale] = "ERROR. Incorrect scale"

#         # timeInit validation
#         try:
#             datetime.strptime(timeInit, '%Y-%m-%d')
#             flagTimeInit = True
#         except ValueError:
#             new_dict[timeInit] = "ERROR. Incorrect format or nonexistent timeInit"

#         # timeEnd validation
#         if timeEnd is None:
#             timeEnd = timeInit
#             flagTimeEnd = True
#         else:
#             try:
#                 datetime.strptime(timeEnd, '%Y-%m-%d')
#                 flagTimeEnd = True
#             except ValueError:
#                 new_dict[timeEnd] = "ERROR. Incorrect format or nonexistent timeEnd"

#         status_code = 404

#         # valid condition
#         if ((apiRoute in ["initCond", "realData"]) and 
#         (compartments in ["SIR", "SEIR", "SEIRHVD"]) and 
#         (scale in ["States", "Counties"])
#          and flagTimeInit and flagTimeEnd):
#             if compartments == "SEIRHVD":
#                 dataset = seirhvdUSA
#             else:
#                 if scale == "States":  # statesUSA
#                     dataset = statesUSA
#                 elif scale == "Counties":  # countiesUSA
#                     dataset = countiesUSA

#             new_dict[sim] = fn.endpointResponse(apiRoute, dataset, compartments, scale, timeInit, timeEnd, spatialSelection)
#             status_code = 200

#     elif request.method == 'GET':
#         new_dict["SUCCESS"] = "Endpoint V1.2 WORKING..."
#         status_code = 200
#     res = jsonify(new_dict,), status_code
#     return make_response(res)

@app.errorhandler(404)
def not_found(e):
    return jsonify(error=str(e)), 404

@app.errorhandler(405)
def not_found(e):
    return jsonify(error=str(e)), 405

@app.errorhandler(400)
def bad_request(e):
    return jsonify(error=str(e)), 400

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify(error=str(e)), 500
