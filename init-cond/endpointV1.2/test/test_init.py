import pytest
from app import app
from test.constants.Path import Path
from test.constants.payload_example import (
    right_payload_states,
    right_payload_counties,
    spatial_selection_not_array,
    wrong_date_format,
    date_init_bigger_end,
    wrong_scale_states,
    wrong_scale_counties,
    wrong_init_date,
    empty_init_date,
    wrong_end_date,
    wrong_compartments,
    empty_info,
    non_json_data,
    date_without_data,
    over_one_model_metapopulation,
    meta_right_payload_states,
    meta_right_payload_counties,
    meta_wrong_scale_states,
    meta_wrong_scale_counties,
    meta_wrong_init_date,
    meta_wrong_end_date,
    meta_wrong_compartments,
    meta_date_without_data,
    meta_empty_init_date
)
from test.constants.responses import success_response, not_found_response, bad_request


@pytest.fixture()
def client():
    """
    It creates a test client for the Flask app
    :return: The test client object.
    """
    return app.app.test_client()


# A decorator that allows to run the same test with different parameters.
@pytest.mark.parametrize(
    "endpoint, code, message",
    [
        ("/api/v0/initCond", 200, success_response),
        ("/api/v0/realData", 200, success_response),
        ("/api/v0/whatever", 404, not_found_response),
        ("/api/v0/data/info", 200, b"nothing"),
    ],
)
def test_status_code_get_calls(endpoint, code, message, client):
    """
    This function tests the status code of the endpoint and the message returned by the endpoint
    
    :param endpoint: the endpoint you want to test
    :param code: The status code you expect to get back from the endpoint
    :param message: The message that should be returned by the endpoint
    :param client: the test client
    """
    get_response_endpoint = client.get(endpoint)
    assert get_response_endpoint.status_code == code
    if endpoint == Path.INFO.value:
        pass
    else:
        assert get_response_endpoint.data == message

@pytest.mark.parametrize(
    "data, code, message, path",
    [
        (right_payload_states, 200, False, Path.INIT_COND.value),
        (right_payload_counties, 200, False, Path.INIT_COND.value),
        (wrong_date_format, 400, bad_request["date"], Path.INIT_COND.value),
        (date_init_bigger_end, 400, bad_request["date_init_bigger"], Path.INIT_COND.value),
        (wrong_scale_states, 400, bad_request["scale"], Path.INIT_COND.value),
        (wrong_scale_counties, 400, bad_request["scale"], Path.INIT_COND.value),
        (wrong_init_date, 400, bad_request["date"], Path.INIT_COND.value),
        (empty_init_date, 400, bad_request["empty"], Path.INIT_COND.value),
        (wrong_end_date, 400, bad_request["date"], Path.INIT_COND.value),
        (wrong_compartments, 400, bad_request["compartments"], Path.INIT_COND.value),
        (wrong_compartments, 400, bad_request["compartments"], Path.INIT_COND.value),
        (empty_info, 400, bad_request["empty"], Path.INIT_COND.value),
        (non_json_data, 400, bad_request["non-json"], Path.INIT_COND.value),
        (right_payload_states, 200, False, Path.REAL_DATA.value),
        (right_payload_counties, 200, False, Path.REAL_DATA.value),
        (wrong_scale_states, 400, bad_request["scale"], Path.REAL_DATA.value),
        (wrong_scale_counties, 400, bad_request["scale"], Path.REAL_DATA.value),
        (wrong_init_date, 400, bad_request["date"], Path.REAL_DATA.value),
        (empty_init_date, 400, bad_request["empty"], Path.REAL_DATA.value),
        (wrong_end_date, 400, bad_request["date"], Path.REAL_DATA.value),
        (wrong_compartments, 400, bad_request["compartments"], Path.REAL_DATA.value),
        (wrong_compartments, 400, bad_request["compartments"], Path.REAL_DATA.value),
        (empty_info, 400, bad_request["empty"], Path.REAL_DATA.value),
        (non_json_data, 400, bad_request["non-json"], Path.REAL_DATA.value),
        (meta_right_payload_states, 200, False, Path.METAPOPULATION_INIT_COND.value),
        (meta_right_payload_counties, 200, False, Path.METAPOPULATION_INIT_COND.value),
        (meta_wrong_scale_states, 400, bad_request["scale"], Path.METAPOPULATION_INIT_COND.value),
        (meta_wrong_scale_counties, 400, bad_request["scale"], Path.METAPOPULATION_INIT_COND.value),
        (meta_wrong_init_date, 400, bad_request["date"], Path.METAPOPULATION_INIT_COND.value),
        (meta_empty_init_date, 400, bad_request["empty"], Path.METAPOPULATION_INIT_COND.value),
        (meta_wrong_end_date, 400, bad_request["date"], Path.METAPOPULATION_INIT_COND.value),
        (meta_wrong_compartments, 400, bad_request["compartments"], Path.METAPOPULATION_INIT_COND.value),
        (meta_wrong_compartments, 400, bad_request["compartments"], Path.METAPOPULATION_INIT_COND.value),
        (empty_info, 400, bad_request["empty"], Path.METAPOPULATION_INIT_COND.value),
        (non_json_data, 400, bad_request["non-json"], Path.METAPOPULATION_INIT_COND.value),
        (spatial_selection_not_array, 400, bad_request["spatialSelection"], Path.METAPOPULATION_INIT_COND.value),
        (meta_right_payload_states, 200, False, Path.METAPOPULATION_REAL_DATA.value),
        (meta_right_payload_counties, 200, False, Path.METAPOPULATION_REAL_DATA.value),
        (meta_wrong_scale_states, 400, bad_request["scale"], Path.METAPOPULATION_REAL_DATA.value),
        (meta_wrong_scale_counties, 400, bad_request["scale"], Path.METAPOPULATION_REAL_DATA.value),
        (meta_wrong_init_date, 400, bad_request["date"], Path.METAPOPULATION_REAL_DATA.value),
        (meta_empty_init_date, 400, bad_request["empty"], Path.METAPOPULATION_REAL_DATA.value),
        (meta_wrong_end_date, 400, bad_request["date"], Path.METAPOPULATION_REAL_DATA.value),
        (over_one_model_metapopulation, 400, bad_request["over-one-model"], Path.METAPOPULATION_REAL_DATA.value),
        (meta_wrong_compartments, 400, bad_request["compartments"], Path.METAPOPULATION_REAL_DATA.value),
        (meta_wrong_compartments, 400, bad_request["compartments"], Path.METAPOPULATION_REAL_DATA.value),
        (empty_info, 400, bad_request["empty"], Path.METAPOPULATION_REAL_DATA.value),
        (non_json_data, 400, bad_request["non-json"], Path.METAPOPULATION_INIT_COND.value),
    ],
)
def test_response_path(data, code, message, path, client):
    post_response_endpoint = client.post(path, json=data)
    assert post_response_endpoint.status_code == code
    if message == False:
        pass
    else:
        assert post_response_endpoint.data == message


# @pytest.mark.parametrize(
#     "data, code, message",
#     [
#         (right_payload_states, 200, False),
#         (right_payload_counties, 200, False),
#         (wrong_scale_states, 400, bad_request["scale"]),
#         (wrong_scale_counties, 400, bad_request["scale"]),
#         (wrong_init_date, 400, bad_request["date"]),
#         (empty_init_date, 400, bad_request["empty"]),
#         (wrong_end_date, 400, bad_request["date"]),
#         (wrong_compartments, 400, bad_request["compartments"]),
#         (wrong_compartments, 400, bad_request["compartments"]),
#         (empty_info, 400, bad_request["empty"]),
#         (date_without_data, 400, bad_request["date_without_data"]),
#     ],
# )
# def test_status_code_init_cond_paths(data, code, message, client):
#     post_response_endpoint = client.post("/api/v0/initCond", json=data)
#     assert post_response_endpoint.status_code == code
#     if type(message) is bool and message == False:
#         pass
#     else:
#         assert post_response_endpoint.data == message
