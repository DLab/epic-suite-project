from app.server import app
import pytest

@pytest.fixture(name="testapp")
async def client():
    return app.test_client()

async def test_status(testapp):
    response = await testapp.get('/status')
    data = await response.get_json()
    assert response.status_code == 200
    assert data == "ok"

