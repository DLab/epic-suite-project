from operator import itemgetter
import time
from quart import Quart, abort, make_response, request, jsonify
from quart_cors import cors
from app.sse.sse import ServerSentEvent
import asyncio
import async_timeout
import uuid
import json
from app.connections.connect_redis import connect_redis as connect
from app.simulate_model import Model, ConfigModel
from app.schedule_task import schedule_task

app = Quart(__name__)
app = cors(app, allow_origin="*")

@app.get("/status")
async def status():
    return await make_response(jsonify("ok"), 200)

@app.post("/simulations")
async def channels():
    try:
        type_sim = request.args.get("type")
        form = await request.get_data()
        id_req = f"{uuid.uuid4()}"
        config = ConfigModel(id_req,type_sim, json.loads(form))
        sim_request = Model()
        sim_request.set_config(config)
        response = await make_response(
            jsonify({"id": id_req, "status": "recieved", "description": "ready"})
        )
        asyncio.create_task(schedule_task(sim_request.simulate_model)).set_name(id_req)
        
        #asyncio.create_task(sim_request.simulate_model()).set_name(id_req)
        return response
    except Exception as error:
        print(error)
        return await make_response("error", 400)


@app.get("/stream")
async def sse():
    ip_addr = request.remote_addr
    if "text/event-stream" not in request.accept_mimetypes:
        abort(400)
    redis_db = connect()
    pubsub = redis_db.pubsub()
    await pubsub.subscribe("simulations")

    async def send_events():
        while True:
            try:
                async with async_timeout.timeout(5):
                    data = await pubsub.get_message()
                    type_data = type(data)
                    if (
                        data is not None
                        and type_data is dict
                        and type(data["data"]) is bytes
                    ):
                        status, event_name, id = itemgetter(
                            "status", "event_name", "id"
                        )(json.loads(data["data"]))
                        # status, event_name = json.loads(data["data"]).items()
                        print("--> sse: ",  "id:", id, "status:", status, "event:", event_name, flush=True)
                        event = ServerSentEvent(
                            json.dumps(json.loads(data["data"])), event_name, 1, 10
                        )
                        yield event.encode()

                    await asyncio.sleep(2)
            except asyncio.CancelledError as error:
                print(error, flush=True)
                t = time.localtime()
                print("exit -> ip: ", ip_addr, time.strftime("%H:%M:%S", t), flush=True)
                await pubsub.unsubscribe()

    response = await make_response(
        send_events(),
        {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Transfer-Encoding": "chunked",
        },
    )
    response.timeout = None
    return response


@app.get("/cancel/<id_req>")
async def cancel(id_req):
    if not id_req:
        return await make_response(jsonify(response="Id is wrong"), 400)
    for task in asyncio.all_tasks(asyncio.get_event_loop()):
        if task.get_name() == id_req:
            print("exit task", task.get_name(), flush=True)
            task.cancel()
    return await make_response(jsonify(id_req))


@app.get("/results/<id_req>")
async def result(id_req):
    if not id_req:
        return await make_response(jsonify(id="undefined"), 404)
    redis = connect()

    try:
        data = await redis.get(id_req)
        if json.loads(data)["status"] == "error":
            return await make_response(jsonify(status="error"), 404)
        return await make_response(jsonify(json.loads(data)["data"]), 200)
    except Exception:
        return await make_response(jsonify(status="error"), 404)
