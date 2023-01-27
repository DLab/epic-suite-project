success_response = b'{"SUCCESS":"Endpoint V1.2 WORKING..."}\n'
not_found_response = b'{"error":"404 Not Found: Resource not found"}\n'
bad_request = {
    "scale": b'{"error":"400 Bad Request: *ERROR. Incorrect scale"}\n',
    "compartments": b'{"error":"400 Bad Request: *ERROR. Incorrect compartments"}\n',
    "date": b'{"error":"400 Bad Request: *ERROR. Incorrect date format or nonexistent"}\n',
    "date_init_bigger": b'{"error":"400 Bad Request: *ERROR. TimeInit must be lesser than timeEnd"}\n',
    "spatialSelection": b'{"error":"400 Bad Request: *ERROR. Spatial selection must be an array"}\n',
    "limits_dates": b'{"error":"400 Bad Request: *ERROR. TimeInit must be lesser than timeEnd"}\n',
    "date_without_data": b'{"error":"400 Bad Request: *ERROR. There is not data for that date or spatial entity"}\n',
    "bad_format": b'{"error":"400 Bad Request: *ERROR. Payload must be a JSON object"}\n',
    "empty": b'{"error":"400 Bad Request: *ERROR. Payload properties cannot be empty"}\n',
    "non-json": b'{"error":"400 Bad Request: The browser (or proxy) sent a request that this server could not understand."}\n',
    "over-one-model": b'{"error":"400 Bad Request: *ERROR. Only 1 metapopulation model for realData"}\n'
}
