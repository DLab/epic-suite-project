#!/usr/bin/env python3
# -*- coding: utf-8 -*-

#import sys
#import pandas as pd
import json
import logging

import numpy as np
from flask import Flask
from flask import jsonify
from flask import request
#from flask import send_file
from flask_cors import CORS
from datetime import datetime
import json
from cv19gm.cv19sim import CV19SIM
import cv19gm.utils.cv19functions as cv19functions
from cv19gm.models.seir_meta import SEIRMETA
import cv19gm.utils.cv19paramfit as cv19paramfit
from rq import Queue
from rq.command import send_stop_job_command
from rq.job import Job
import redis
from background_tasks import datafit_task, simulate_meta_task, publish_status_simulation, send_task
import uuid
from get_mobility_matrix import matrix_builder,matrix_usa, matrix_js

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})
redis_conn = redis.from_url("redis://redis:6379")
q = Queue(connection=redis_conn)

"""
# ------------------------- #
#     GUI communication     #
# ------------------------- #
"""
@app.route("/")
def index():
    return "<h1>Epic Suite Backend Server is up</h1>"

@app.route('/health_check', methods=['GET'])
def health_check():
    '''
    health_check
    '''
    app.logger.info("health_check")
    response = {'status': 'OK'}
    return jsonify(response), 200

@app.route('/jobs', methods=['GET'])
def get_jobs():
    return q.job_ids, 200

@app.route('/test', methods=['POST'])
def test():
    try: 

        # 1. Get params
        form =  request.form
        data = form.to_dict()
        print(data)
        print(type(data))

        # 2. Build cv19sim object
        sim = CV19SIM(data)

        # 3. Simulate
        sim.solve()

        response = {'status': 'OK','result' : data}

        return jsonify(response), 200
    except:
        response = {"error": "Unkown error"}
        return response, 200

@app.route('/simulate', methods=['POST'])
def simulate():
    '''
    http://192.168.2.223:5003/simulate?campo=1

    Estructura del código
     1.- leer parámetros
     2.- Crear objetdo de simulación
     3.- Simular. Lanzar un warning del tiempo que se puede tomar si es que es una RBM
     4.- Retornar los resultados
    '''
    try:
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print("Simulating monopopulation model (", current_time,")")
        
        cfg =  request.get_json(force=True)
        results = {}
        for key,value in cfg.items():
            print(key) 
            sim = CV19SIM(dict(value))
            sim.solve()
            results.update({key:sim.sims[0].results.to_json()})

        response = {'status': 'OK','results' : results}
        return jsonify(response), 200
    
    except Exception as e: 
        print(e)        
        response = {"error": "Wrong parameters"}
        return response, 400 
    
@app.route('/simulate_meta', methods=['POST'])
def simulate_meta():
    '''
    http://192.168.2.223:5003/simulate_meta?campo=1

    Estructura del código
     1.- leer parámetros
     2.- Crear objetdo de simulación
     3.- Simular. Lanzar un warning del tiempo que se puede tomar si es que es una RBM
     4.- Retornar los resultados
    '''
    try:
        random_id = uuid.uuid4()
        id_sim = str(random_id)
        cfg =  request.get_json(force=True)
        print("------------ Sending to simulate -----------",flush=True)
        publish_status_simulation({'status': 'RECIEVED', 'id': id_sim}, "metapopulation")
        q.enqueue(send_task,simulate_meta_task, cfg, id_sim,"metapopulation", job_id=id_sim, job_timeout=100000)
        return {"status": "recieved", "id": id_sim}, 200
    except Exception as e: 
        print("------------ Error -----------",e, flush=True)        
        print(e, flush=True)        
        response = {"error": "Wrong parameters"}
        return response, 400    

@app.route("/simulate_meta_status/<id_sim>")
def simulate_meta_actions(id_sim):
    is_cancel = request.args.get("cancel")
    try:
        if is_cancel == "true":
            status = Job.fetch(id_sim, connection=redis_conn)
            if status == "started":
                send_stop_job_command(redis_conn,id_sim)
                publish_status_simulation({'status': 'CANCELED', 'id': id_sim}, "metapopulation")
                return {"status": "cancelled", "id": id_sim}, 200
            elif status == None:
                return f'There is not a job with {id_sim}', 200
            else:
                status.cancel()
                publish_status_simulation({'status': 'CANCELED', 'id': id_sim}, "metapopulation")
                return {"status": "cancelled", "id": id_sim}, 200          
        else:
            job = Job.fetch(id_sim, connection=redis_conn)
            print('Status: %s' % job.get_status(),flush=True)
            return job.get_status(), 200
    except Exception as e: 
        print(e, flush=True)
        return {"status": "error", "id": id_sim}, 500
        
@app.route('/function', methods=['POST'])
def function():
    '''
    http://192.168.2.223:5003/function?campo=1

    Estructura del código
     1.- leer parámetros
     2.- Crear objetdo de simulación
     3.- Simular. Lanzar un warning del tiempo que se puede tomar si es que es una RBM
     4.- Retornar los resultados
    '''
    try:
        cfgfunction =  request.get_json(force=True)
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print("Building function ",str(cfgfunction['function'])," (", current_time,")")                
        function = cv19functions.build(cfgfunction['function'])
        t = np.linspace(cfgfunction['t_init'],cfgfunction['t_end'],(cfgfunction['t_end']-cfgfunction['t_init'])*10+1)
        functionarray = function(t)
        response = {'status': 'OK','results' : {'t':list(t),'function':list(functionarray)}}
        return jsonify(response), 200
    
    except Exception as e:
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        print("Error ",current_time)
        print(e)        
        response = {"error": "Wrong parameters"}
        return response, 400    
 
@app.route('/datafit', methods=['POST'])
def datafit():
    """Optimal parameters for fitting data

    Returns:
        _type_: _description_
    """
    try:
        cfg =  request.get_json(force=True)
        random_id = uuid.uuid4()
        id_sim = str(random_id)
        print("------------ Sending to fit -----------",flush=True)
        publish_status_simulation({'status': 'RECIEVED', 'id': id_sim}, "datafit")
        q.enqueue(send_task,datafit_task, cfg, id_sim,"datafit", job_id=id_sim, job_timeout=100000)
        return {"status": "RECIEVED", "id": id_sim}, 200
    except Exception as e: 
        print("\033[4;35;47m"+"------------ Error -----------"+'\033[0;m',e, flush=True)        
        print(e, flush=True)        
        response = {"error": "Wrong parameters"}
        return response, 400    

@app.route("/mobility/<source>",methods=["POST"])
def get_matrix_custom(source):
    try:
        cfg =  request.get_json(force=True)
        matrix = None
        if source == "custom":
            matrix = matrix_builder(cfg)
        if source == "usa":
            matrix = matrix_usa(json.dumps(cfg)) 
        return jsonify(matrix_js(matrix)), 200
    except Exception as e:
        print("\033[4;35;47m"+"------------ Error -----------"+'\033[0;m',e, flush=True)        
        print(e, flush=True)        
        response = {"error": "Wrong parameters"}
        return response, 400   
