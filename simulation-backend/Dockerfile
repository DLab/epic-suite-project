#Conda image
FROM continuumio/miniconda3

#Copy cv19gm library. It must be installed before to do anything.
COPY covid19geomodeller .


# Create the environment:
COPY environment.yml .
RUN conda env create -f environment.yml

# Make RUN commands use the new environment:
RUN echo "conda activate myenv" >> ~/.bashrc
SHELL ["/bin/bash", "--login", "-c"]

# Demonstrate the environment is activated:
# The code to run when container is started:
#COPY . .
#WORKDIR /covid19geomodeller
RUN python setup.py install
WORKDIR /app
COPY backend .
COPY install.sh .
COPY worker.sh .

RUN python -c "import flask"
RUN echo "Make sure rq is installed:"
RUN python -c "import rq"
RUN echo "Make sure cv19gm is installed"
RUN python -c "import cv19gm"

#ENTRYPOINT ["$hola"]