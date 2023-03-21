# Install python
FROM python:3.8-alpine 
# set folder for api
WORKDIR /initial_conditions_app

RUN echo "@testing http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk add --update --no-cache py3-numpy py3-pandas@testing g++
ENV PYTHONPATH=/usr/lib/python3.8/site-packages
COPY requirements.txt requirements.txt
# update pip and install packages
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# set port
EXPOSE 5002
# copy code from repository to container
COPY . .
# set environment variables flask
ENV FLASK_APP=app.app.py
ENV FLASK_RUN_HOST=0.0.0.0
# run api in container
#ENTRYPOINT [ "./script.sh" ]
#CMD ["flask", "run", "--host=0.0.0.0", "--port=5002"]
CMD ["gunicorn", "--bind", "0.0.0.0:5002", "app.app:app"]
