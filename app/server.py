import asyncio
import json
from operator import itemgetter
import uuid
from app.connections.connect_redis import Connect, RedisDatabase, StatusMessage, StatusSimulation
from fastapi import FastAPI, Request
from app.constants.pub import CHANNEL_REDIS_PUB, RETRY_TIMEOUT, STREAM_DELAY
from sse_starlette.sse import EventSourceResponse
from fastapi.middleware.cors import CORSMiddleware
import traceback

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/status")
async def status():
    return {"status":"ok"}

@app.post("/publish/{type}")
async def publish_status_simulation(type: str, request: Request):
    form = await request.json()
    await RedisDatabase.publish(json.dumps(StatusMessage(form["id"],type,StatusSimulation[form["status"]]).get_message()))
    if "data" in form and form["status"] == StatusSimulation.FINISHED.name:
        await RedisDatabase.save_results(form["id"],form["status"],form['data'])
    else:
        await RedisDatabase.save_results(form["id"],form["status"])
    return {"ok": 200}

@app.get("/process/{id_process}")
async def process_status_simulation(id_process: str):
    try:
        print("Processing",id_process, flush=True)
        data = await RedisDatabase.get_data(id_process)
        if data is None:
            return {"message":f"There is not any process with id {id_process}"}, 404
        return data
    except ValueError:
        return {"error": "Invalid process id"}, 400

@app.get('/stream')
async def message_stream(request: Request):
    print("sse connected", flush=True)
    

    async def new_messages(pub):
        # Add logic here to check for new messages
        if await pub.wait_message():
            yield True
        yield False

    async def event_generator(request):
        redis_db = Connect.connect_redis()
        pubsub = redis_db.pubsub()
        await pubsub.subscribe(CHANNEL_REDIS_PUB)
        while True:
            # If client closes connection, stop sending events
            try:

                is_client_disconnected = await request.is_disconnected()
                if is_client_disconnected:
                    #await pubsub.unsubscribe(CHANNEL_REDIS_PUB)
                    break

                # Checks for new messages and return them to client if any
                if new_messages(pubsub):
                    data = await pubsub.get_message()
                    type_data = type(data)
                    if (
                        data is not None
                        and type_data is dict
                        and type(data["data"]) is bytes
                    ):
                        status, event_name, id = itemgetter(
                            "status", "event", "id"
                        )(json.loads(data["data"]))
                        # status, event_name = json.loads(data["data"]).items()
                        print("--> sse: ",  "id:", id, "status:", status, "event:", event_name, flush=True)
                        yield {
                                "event": event_name,
                                "id": "message_id",
                                "retry": RETRY_TIMEOUT,
                                "data": json.dumps(json.loads(data["data"]))
                        }

                await asyncio.sleep(STREAM_DELAY)
            except Exception as e:
                print("Error:", e, flush=True)
                await pubsub.unsubscribe(CHANNEL_REDIS_PUB)
                traceback.print_exc()
                break
    return EventSourceResponse(event_generator(request))