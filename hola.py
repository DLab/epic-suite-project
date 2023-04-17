import json

cfg_example = {
    "20200404": '{"10001":{"10001":0,"10003":12906,"10005":5189},"10003":{"10001":3852,"10003":0,"10005":4877},"10005":{"10001":4043,"10003":12865,"10005":0}}',
    "20200405": '{"10001":{"10001":0,"10003":11568,"10005":4577},"10003":{"10001":3222,"10003":0,"10005":4847},"10005":{"10001":3442,"10003":11011,"10005":0}}',
}

def json_to_matrix(json_str):
    obj = json.loads(json_str)
    keys = list(obj.keys())
    matrix = [[obj[row_key][col_key] for col_key in keys] for row_key in keys]
    return matrix

matrices = {}

for key in cfg_example:
    parsed_json = json.loads(cfg_example[key])
    matrices[key] = {
        "values": json_to_matrix(cfg_example[key]),
        "tags": list(parsed_json.keys()),
    }

print(matrices)
