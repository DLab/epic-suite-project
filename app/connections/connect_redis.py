from redis import asyncio as aioredis
from enum import Enum
from app.constants.pub import CONNECTION_REDIS
import json
import aiohttp
from typing import TypeVar

async def request_simulation(url, data):
    async with aiohttp.ClientSession() as session:
         async with session.post(url, json=data) as resp:
            response = await resp.json()
            return response

class Connect:
    @staticmethod
    def connect_redis():
        return aioredis.from_url(CONNECTION_REDIS)


class StatusSimulation(Enum):
    NOT_STARTED = "Simulation request not yet started"
    RECIEVED = "Simulation parameters received successfully"
    STARTED = "Processing your request"
    FINISHED = "Simulation was successful"
    ERROR = "Any error encountered during simulation"
    CANCELED = "Simulation was canceled"

class StatusMessage:
    def __init__(self, id_sim, event, status: StatusSimulation) -> None:
        self.id = id_sim
        self.event = event
        self.status = status.name
        self.description = status.value
    
    def set_status(self, status: StatusSimulation) -> None:
        self.status = status.name
        self.description = status.value
    def get_message(self):
        return {'id': self.id, 'event': self.event, 'status': self.status, 'description': self.description}

class RedisDatabase():
    @staticmethod
    async def publish(message):
        conn = Connect.connect_redis()
        await conn.publish("simulations", message)
        await conn.close()
        
    @staticmethod
    async def save_results(id, status=StatusSimulation.NOT_STARTED.name, results={"results":None}):
        data = {"status": status, "results": results or ""}
        # data = {"status": status, "results": results["results"] or ""}
        conn = Connect.connect_redis()
        await conn.set(id, json.dumps(data))
        await conn.expire(id, 300)
        await conn.close()
    @staticmethod
    async def verify_is_cached(self,id) -> bool:
        conn = Connect.connect_redis()
        is_in_db = await conn.get(id)
        if bool(is_in_db):
            await self.publish(StatusMessage(id, is_in_db["event"] , StatusSimulation.FINISHED).get_message())
            return True
        await conn.expire(id, 60)
        await conn.close()
        return False
    @staticmethod
    async def get_data(id):
        conn = Connect.connect_redis()
        data = await conn.get(id)
        return data
