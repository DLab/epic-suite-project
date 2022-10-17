FROM python:3.10-alpine
WORKDIR /sse
RUN echo "@testing http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk add --no-cache --virtual build-deps file make gcc musl-dev libffi-dev linux-headers
RUN apk add --update --no-cache g++
ENV PYTHONPATH=/usr/lib/python3.8/site-packages
COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
#ENV FLASK_APP=sse.py
#ENV FLASK_RUN_HOST=0.0.0.0
COPY . .
EXPOSE 9000
# CMD [ "hypercorn","--bind","0.0.0.0:9000", "example:app"]
CMD [ "hypercorn","-b","0.0.0.0:9000", "app.server:app", "--debug", "--config", "format.toml", "--access-logfile","-"]
# CMD [ "hypercorn","-b","0.0.0.0:9000", "app.server:app", "--debug", "--access-logfile", "-"]