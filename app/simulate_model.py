
from enum import Enum
import json

import requests
from app.connections.connect_redis import connect_redis as connect, publish_redis as pub
import asyncio
import aiohttp
from dataclasses import dataclass
import random

# def sync_request(url, data):
#     r = requests.post(url, data=json.dumps(data))
#     response = r.json()
#     return response

# async def send_async_request(session, url, data):
#     async with session.post(url, json=data) as resp:
#         response = await resp.json()
#         return response


# async def send_sim_as_coroutine(url, data):
#     async with aiohttp.ClientSession() as session:
#         return await asyncio.ensure_future(send_async_request(session, url, data))


# async def send_async_request(session, url, data):
#     async with session.post(url, json=data) as resp:
#         response = await resp.json()
#         return response

async def send_sim_as_coroutine(url, data):
    async with aiohttp.ClientSession() as session:
         async with session.post(url, json=data) as resp:
            response = await resp.json()
            return response

# def get_random_integer(init = 0, end = 800):
#     return random.randint(init, end)
# async def send_async_request(session, url, data):
#     async with session.get(f"https://pokeapi.co/api/v2/pokemon/{get_random_integer()}", json=data) as resp:
#         response = await resp.json()
#         return response['name']


# async def send_sim_as_coroutine(url, data):
#     async with aiohttp.ClientSession() as session:
#         return await asyncio.create_task(send_async_request(session, url, data))


class StatusSimulation(Enum):
    NOT_STARTED = "Simulation request not yet started"
    RECIEVED = "Simulation parameters received successfully"
    PROCESSING = "Processing your request"
    SUCCESS = "Simulation was successful"
    ERROR = "Any error encountered during simulation"


# URL_BASE = "http://192.168.2.131:5003/"
URL_BASE = "http://0.0.0.0:5003/"


class PathByTypeSimulation(Enum):
    metapopulation = f"{URL_BASE}/simulate_meta"
    datafit = f"{URL_BASE}/datafit"


class ConfigModel:
    def __init__(self, id, model, request_model):
        self.id = id
        self.model = model
        self.request = request_model

@dataclass
class Model:
    __config = None
    __response = None
    __conection = None

    def get_id(self):
        return self.__config.id
    
    def set_config(self, config: ConfigModel):
        self.__config = config
    
    def set_message_event(self, status: StatusSimulation, description: str = None):
        return json.dumps(
            {
                "id": self.get_id(),
                "event_name": self.__config.model,
                "status": status.name,
                "description": description or status.value,
            }
        )

    def _set_response_for_redis(self, status: StatusSimulation, response: any):
        self.__response = response
        return json.dumps(
            {
                "id": self.get_id(),
                "event_name": self.__config.model,
                "request": self.__config.request,
                "status": status.name,
                "description": status.value,
                "data": self.__response,
            }
        )

    def _redis_connection(self):
        self.__conection = connect()

    async def __notify_queue_message_sse(self, message) -> None:
        await pub("simulations", self.set_message_event(message))

    async def __verify_input_sim_is_cached(self):
        self._redis_connection()
        requested_config_model = await self.__conection.get(self.get_id())
        if requested_config_model is None:
            self._set_response_for_redis(StatusSimulation.NOT_STARTED, {})
            await self.__conection.set(
            self.get_id(),
            self._set_response_for_redis(StatusSimulation.NOT_STARTED, {}),
        )
            return False
        json_requested_config_model = json.loads(requested_config_model)
        if (
            json_requested_config_model["event_name"] == self.__config.request
            and json_requested_config_model["data"] is None
        ):
            return False

        if json_requested_config_model["status"] == StatusSimulation.ERROR.name:
            self._set_response_for_redis(StatusSimulation.NOT_STARTED, {})
            await self.__conection.set(
            self.get_id(),
            self._set_response_for_redis(StatusSimulation.NOT_STARTED, {}),
        )
            return False
        return True

    async def simulate_model(self):
        self._redis_connection()

        try:
            if await self.__verify_input_sim_is_cached():
                
                await self.__notify_queue_message_sse(StatusSimulation.SUCCESS)
                pass
            else:
                await self.__conection.set(
                    self.get_id(),
                    self._set_response_for_redis(StatusSimulation.RECIEVED, {}),
                )
                await self.__notify_queue_message_sse(StatusSimulation.RECIEVED)
                await self.__conection.set(
                    self.get_id(),
                    self._set_response_for_redis(StatusSimulation.PROCESSING, {}),
                )
                await self.__notify_queue_message_sse(StatusSimulation.PROCESSING)
                if self.__config.model == PathByTypeSimulation.metapopulation.name:
                    # self.__response = sync_request(
                    #     PathByTypeSimulation.metapopulation.value,
                    #     self.__config.request,
                    # )
                    self.__response = await send_sim_as_coroutine(
                        PathByTypeSimulation.metapopulation.value,
                        self.__config.request,
                    )

                elif self.__config.model == PathByTypeSimulation.datafit.name:
                    self.__response = await send_sim_as_coroutine(
                        PathByTypeSimulation.datafit.value, self.__config.request
                    )
                else:
                    raise Exception("Unknown type")
                await (self.__conection).set(
                    self.get_id(),
                    self._set_response_for_redis(StatusSimulation.SUCCESS, self.__response),
                )
                await self.__conection.expire(self.get_id(), 60)
                await self.__notify_queue_message_sse(StatusSimulation.SUCCESS)

        except Exception as e:
            print("error: ", e, flush=True)
            await (self.__conection).set(
                self.get_id(),
                self._set_response_for_redis(
                    StatusSimulation.ERROR, {}
                ),
            )
            await self.__conection.expire(self.get_id(), 1)
            await self.__notify_queue_message_sse(StatusSimulation.ERROR)
