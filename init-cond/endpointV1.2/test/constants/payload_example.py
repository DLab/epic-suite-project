right_payload_states = {
    "sim1": {
        "scale": "States",
        "compartments": "SIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "spatialSelection": ["13","05"],
    },
    "sim2": {
        "compartments": "SEIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "scale": "States",
        "spatialSelection": ["08"],
    },
}
right_payload_counties = {
    "sim1": {
        "scale": "Counties",
        "compartments": "SIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "spatialSelection": ["36001"],
    },
    "sim2": {
        "compartments": "SIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "scale": "Counties",
        "spatialSelection": ["04015"],
    },
}
wrong_scale_states = {
    "sim1": {
        "scale": "State",
        "compartments": "SIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "spatialSelection": ["13","05"],
    },
    "sim2": {
        "compartments": "SEIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "scale": "States",
        "spatialSelection": ["08"],
    },
}
wrong_scale_counties = {
    "sim1": {
        "scale": "County",
        "compartments": "SIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "spatialSelection": ["22105"],
    },
    "sim2": {
        "compartments": "County",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "scale": "States",
        "spatialSelection": ["04015"],
    },
}
wrong_init_date = {
    "sim1": {
        "scale": "States",
        "compartments": "SIR",
        "timeInit": "2021-01-32",
        "timeEnd": "2021-02-01",
        "spatialSelection": ["13","05"],
    },
    "sim2": {
        "compartments": "SEIR",
        "timeInit": "2021-01-32",
        "timeEnd": "2021-02-01",
        "scale": "States",
        "spatialSelection": ["08"],
    },
}
empty_init_date = {
    "sim1": {
        "scale": "States",
        "compartments": "SIR",
        "timeInit": "",
        "timeEnd": "2021-02-01",
        "spatialSelection": ["13","05"],
    },
    "sim2": {
        "compartments": "SEIR",
        "timeInit": "2020-04-30",
        "timeEnd": "2021-02-01",
        "scale": "States",
        "spatialSelection": ["08"],
    },
}
wrong_end_date = {
    "sim1": {
        "scale": "States",
        "compartments": "SIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-22-01",
        "spatialSelection": ["13","05"],
    },
    "sim2": {
        "compartments": "SEIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-22-01",
        "scale": "States",
        "spatialSelection": ["08"],
    },
}
wrong_compartments = {
    "sim1": {
        "scale": "Counties",
        "compartments": "SITH",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "spatialSelection": ["22105"],
    },
    "sim2": {
        "compartments": "Counties",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "scale": "States",
        "spatialSelection": ["04015"],
    },
}
empty_info = {}
non_json_data = None
date_without_data = {
    "sim1": {
        "scale": "States",
        "compartments": "SIR",
        "timeInit": "",
        "timeEnd": "2021-02-01",
        "spatialSelection": ["13","05"],
    },
    "sim2": {
        "compartments": "SEIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "scale": "States",
        "spatialSelection": ["08"],
    },
}
over_one_model_metapopulation = {
    "sim1": {
        "scale": "States",
        "compartments": "SIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "spatialSelection": ["13","05"],
    },
    "sim2": {
        "compartments": "SEIR",
        "timeInit": "2021-01-31",
        "timeEnd": "2021-02-01",
        "scale": "States",
        "spatialSelection": ["08"],
    },
}
wrong_date_format = {
    "sim1": {
        "scale": "Counties",
        "compartments": "SIR",
        "timeInit": "2",
        "timeEnd": "2021-02-01",
        "spatialSelection": ["36001"],
    }
}
date_init_bigger_end = {
    "sim1": {
        "scale": "Counties",
        "compartments": "SIR",
        "timeInit": "2021-02-04",
        "timeEnd": "2021-02-01",
        "spatialSelection": ["36001"],
    }
}
spatial_selection_not_array = {
    "sim1": {
        "scale": "States",
        "compartments": "SIR",
        "timeInit": "2021-01-04",
        "timeEnd": "2021-02-01",
        "spatialSelection": "13",
    }
}
# METAPOPULATION IN REAL_DATA PATH
meta_right_payload_states = {'sim1': {'name': 'sim1', **right_payload_states['sim1']}}
meta_right_payload_counties = {'sim1': {'name': 'sim1', **right_payload_counties['sim1']}}
meta_wrong_scale_states = {'sim1': {'name': 'sim1', **wrong_scale_states['sim1']}}
meta_wrong_scale_counties = {'sim1': {'name': 'sim1', **wrong_scale_counties['sim1']}}
meta_wrong_init_date = {'sim1': {'name': 'sim1', **wrong_init_date['sim1']}}
meta_wrong_end_date = {'sim1': {'name': 'sim1', **wrong_end_date['sim1']}}
meta_wrong_compartments = {'sim1': {'name': 'sim1', **wrong_compartments['sim1']}}
meta_empty_init_date = {'sim1': {'name': 'sim1', **empty_init_date['sim1']}}
meta_date_without_data = {'sim1': {'name': 'sim1', **date_without_data['sim1']}}
