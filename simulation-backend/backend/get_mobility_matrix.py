import json
import requests
import cv19gm.utils.cv19mobility as cv19mobility

# modify this functions
def matrix_builder(cfg):
    """Build artificial mobility matrix

    Args:
        cfg (dict): Dictionary with parameters for builing the mobility matrix
        
    
    Returns:
        matrix (np.array): Mobility matrix
        
    cfg:
    * populations: list of populations
    * model: 'gravity', 'radiation' or 'random'
    * fraction [optional]: fraction of the population that moves
    * seed [optional]: seed for random number generator    
    
    """
    return cv19mobility.create_mobility_matrix(**cfg)
   
    

config_get_matrix={
  "timeInit":"2020-04-04",
  "timeEnd": "2020-04-05",
  "scale":"States",
  "spatialSelection":["10"],
  "others": False 
}
def matrix_usa(cfg):
   sda = requests.post("http://192.168.2.131:5010/v0/mOD/counties", data=cfg)
   return sda.json()

def json_to_matrix(json_str):
    obj = json.loads(json_str)
    keys = list(obj.keys())
    matrix = [[obj[row_key][col_key] for col_key in keys] for row_key in keys]
    return matrix


def matrix_js(cfg_example):
    matrices = {}     
    for key in cfg_example:
        parsed_json = json.loads(cfg_example[key])
        matrices[key] = {
            "values": json_to_matrix(cfg_example[key]),
            "tags": list(parsed_json.keys()),
        }
    return matrices

