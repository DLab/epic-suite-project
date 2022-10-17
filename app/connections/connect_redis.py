from redis import asyncio as aioredis

def connect_redis():
    return aioredis.from_url("redis://redis:6000")

async def publish_redis(channel, data):
    redis = connect_redis()
    await redis.publish(channel, data)
