import aiojobs

async def schedule_task(func) -> None:
    scheduler = aiojobs.Scheduler()
    job = await scheduler.spawn(func())
    # await scheduler.close()