from flask import abort
from datetime import datetime
import collections.abc
import numpy as np

format = "%Y-%m-%d"


def validate_datetime(dateToValidate=None):
    """
    It takes a string as an argument and returns True if the string is a valid date and False if it is
    not
    
    :param dateToValidate: The date to validate
    :return: True or False
    """
    if dateToValidate is None:
        return False
    try:
        isValidated = datetime.strptime(dateToValidate, format)
        return True
    except Exception:
        return False

def get_attribute_from_dict(dict_for_extraction: dict, key: str):
    """
    It takes a dictionary and a key as arguments, and returns the value of the key in the dictionary
    
    :param dict_for_extraction: The dictionary that we want to extract the value from
    :type dict_for_extraction: dict
    :param key: The key to be extracted from the dictionary
    :type key: str
    :return: The value of the key in the dictionary.
    """
    try:
        return list(dict_for_extraction.values())[0][key]
    except KeyError as e:
        abort(400, description="*ERROR. Payload properties cannot be empty")

def verify_request_covid_series(
    compartments, timeInit, timeEnd, scale, spatialSelection
):
    """
    It verifies that the request payload is correct and returns an error if it is not
    
    :param compartments: The compartmental model to use
    :param timeInit: The start date of the time series
    :param timeEnd: The end date of the time series
    :param scale: "States" or "Counties"
    :param spatialSelection: array of strings
    """
    if not compartments or not timeInit or not scale or not spatialSelection:
        abort(400, description="*ERROR. Payload properties cannot be empty")
    if compartments not in ["SIR", "SEIR", "SEIRHVD"]:
        abort(400, description="*ERROR. Incorrect compartments")
    if scale not in ["States", "Counties"]:
        abort(400, description="*ERROR. Incorrect scale")
    if not validate_datetime(timeInit) or not validate_datetime(timeEnd):
        abort(400, description="*ERROR. Incorrect date format or nonexistent")
    if not datetime.strptime(timeInit, format) or not datetime.strptime(
        timeInit, format
    ):
        abort(400, description="*ERROR. Incorrect date format or nonexistent")
    if datetime.strptime(timeInit, format) > datetime.strptime(timeEnd, format):
        abort(400, description="*ERROR. TimeInit must be lesser than timeEnd")
    if not isinstance(
        np.array(spatialSelection), (collections.abc.Sequence, np.ndarray)
    ):
        abort(400, description="*ERROR. Spatial selection must be an array")


def verify_right_properties_in_payload(whitelist: list, data: dict):
    """
    It checks if the payload is empty, if it's a JSON object, and if the whitelist is a list
    
    :param whitelist: list of properties that are allowed in the payload
    :type whitelist: list
    :param data: The payload that is sent to the API
    :type data: dict
    """
    if not data:
        abort(400, description="*ERROR. Payload properties cannot be empty")
    if type(data) is not dict:
        abort(400, description="*ERROR. Payload must be a JSON object")
    if type(whitelist) is not list:
        abort(500, description="*ERROR. Internal error, please try again later")
