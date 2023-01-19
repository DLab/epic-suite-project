FROM python:3.9
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./app /code/app

#CMD ["uvicorn", "app.server:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "9000"]
CMD [ "hypercorn","--bind","0.0.0.0:9000", "app.server:app", "--debug"]