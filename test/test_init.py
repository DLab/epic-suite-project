from operator import itemgetter
from app.server import app
import pytest
from httpx import AsyncClient
import json
import time

pytestmark = pytest.mark.anyio
# redis = create_redis_fixture()
@pytest.fixture
def anyio_backend():
    """Exclude trio from tests"""
    return "asyncio"

@pytest.fixture(name="testapp")
async def async_client_fixture():
    return AsyncClient(app=app, base_url="http://localhost:9000")


@pytest.mark.parametrize(
    "endpoint, code, message",
    [
        ("/", 200, {"message": "Hello World"}),
        ("/status", 200, {"status": "ok"}),
    ],
)
async def test_simple_route(endpoint, code, message, testapp):

    response = await testapp.get(endpoint)

    data = response.json()
    assert response.status_code == code
    assert data == message


@pytest.mark.parametrize(
    "data, code, message",
    [
        ({"id": "1234", "status": "NOT_STARTED"},200,{"ok": 200}),
        ({"id": "1234", "status": "STARTED"},200,{"ok": 200}),
        ({"id": "1234", "status": "CANCELED"},200,{"ok": 200}),
        ({"id": "1234", "status": "FINISHED", "results": "asdf"},200,{"ok": 200}),
        ({"id": "1234", "status": "ERROR"},200,{"ok": 200}),
    ],
)
async def test_publish_status_simulation(data,code,message,testapp):
    response = await testapp.post(
        "/publish/metapopulation", json=data
    )
    assert response.status_code == code
    assert response.json() == message
    time.sleep(2)


async def test_process_id(testapp):
    response = await testapp.get("/process/1234")
    data =  json.loads(response.json())
    status, results = itemgetter('status','results')(data)
    assert response.status_code == 200
    assert status == "ERROR"
    assert results == ""