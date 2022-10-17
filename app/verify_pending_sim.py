from app.connections.connect_redis import connect_redis as connect
import json

async def verify_pending_sim(ip):
    try:
        redis = await connect()
        data = await redis.get(ip)
        print(json.loads(data)["status"])
        if json.loads(data)["status"] == "SUCCESS":
            return False
        return True
    except Exception:
        return False

