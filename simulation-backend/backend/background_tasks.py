from datetime import datetime
import sys, traceback
import requests
from cv19gm.models.seir_meta import SEIRMETA
import json
import cv19gm.utils.cv19paramfit as cv19paramfit
import numpy as np
import traceback

def publish_status_simulation(status, type):
    requests.post(f"http://sse:9000/publish/{type}", json = status)

def send_task(task, input_task, job_id, typeSim):
    try:
        publish_status_simulation({'status': 'STARTED', 'id': job_id}, typeSim)
        show_initial_simulation_time(f'Simulating {typeSim} model')
        response = task(input_task)
        publish_status_simulation({**response, 'id': job_id}, typeSim)
    except Exception as e:
        print(e, flush=True)
        traceback.print_exc()
        publish_status_simulation({'status': 'ERROR', 'id': job_id}, typeSim)

def simulate_meta_task(input):
    results = {}
    global_results = {}
    # publish_status_simulation({'status': 'STARTED', 'id': job_id}, "metapopulation")
    # show_initial_simulation_time("Simulating metapopulation model")
    
    # data = json.loads(input)['data']
    #data = json.loads(input)
    for key,value in input.items():
        print(key)
        cfg = dict(value)
        print("cfg",cfg)
        sim = SEIRMETA(cfg)
        print('Simulating may take some time')
        sim.solve() 
        aux = {}
        
        # Assigns the fips code to the data. Could be done in the simulation library 
        if sim.cfg['data']['state']:
            names = sim.cfg['data']['state']
        elif sim.cfg['data']['county']:
            names = sim.cfg['data']['county']
        else: 
            names = [str(i) for i in range(sim.nodes)]
            
        for i in range(sim.nodes):
            aux[names[i]] = sim.results.loc[sim.results['node']==i].to_dict('list')               
                
        results.update({key:json.dumps(aux)})            
        global_results.update({key:sim.global_results.to_json()})
    return {'status': 'FINISHED', 'data': {'results' : results,'global_results' : global_results}}
        # publish_status_simulation(response, "metapopulation")
    # except Exception as e:
    #     print(e, flush=True)
    #     traceback.print_exc()
    #     publish_status_simulation({'status': 'ERROR', 'id': job_id}, "metapopulation")

def datafit_task(input):
    """Optimal parameters for fitting data

    Returns:
        _type_: _description_
    """
    # try:
    show_initial_simulation_time("Finding optimal parameters")
    results = {}
    fit = cv19paramfit.SEQUENTIAL_FIT(cfg = 'SEIR.toml', I_d_data=np.array(list(json.loads(input['I_d_data']).values())),t_data = np.array(list(json.loads(input['t_data']).values())),global_errortol=200, local_errortol=250, 
        intervalsize=10, maxintervals=5, bounds_beta=[0,1], bounds_mu=[0,4],tE_I = input['tE_I'],tI_R = input['tI_R'])
    
    fit.optimize()
                
    results['beta_values'] = str(fit.beta_values)
    results['beta_days'] = str(fit.beta_days)
    results['mu'] = fit.mu
    results['simulation'] =  fit.sim.sims[0].results.to_json()
    
    return {'status': 'FINISHED', 'data' : {'results': results }}
    #publish_status_simulation(response, "datafit")
    
    # except Exception as e: 
    #     print("\033[4;35;47m"+"------------ Error -----------"+'\033[0;m'+"\n",e, flush=True) 
    #     exc_type, exc_value, exc_traceback = sys.exc_info()  
    #     print(repr(traceback.extract_tb(exc_traceback))) 
    #     publish_status_simulation({'status': 'ERROR', 'id': job_id}, "datafit")


def show_initial_simulation_time(message):
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    print(message," (", current_time,")")