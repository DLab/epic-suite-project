#!/bin/sh
docker compose down
docker image rm endpointv12-web	
docker compose build
docker compose up -d