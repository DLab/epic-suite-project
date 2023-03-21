#Conda image
FROM continuumio/miniconda3



# Create the environment:
COPY environment.yml .
RUN conda env create -f environment.yml

# Make RUN commands use the new environment:
RUN echo "conda activate myenv" >> ~/.bashrc
SHELL ["/bin/bash", "--login", "-c"]

# Demonstrate the environment is activated:
# The code to run when container is started:
#COPY . .
#Copy cv19gm library. It must be installed before to do anything.
RUN apt-get install -y git
 
# download and add a public key, and clone a repo and install with pip
RUN git clone https://github.com/DLab/covid19geomodeller.git
WORKDIR /covid19geomodeller
#COPY covid19geomodeller .

RUN python setup.py install

WORKDIR /app
COPY backend ./backend
COPY install.sh .
COPY worker.sh .

RUN python -c "import flask"
RUN echo "Make sure rq is installed:"
RUN python -c "import rq"
RUN echo "Make sure cv19gm is installed"
RUN python -c "import cv19gm"

#ENTRYPOINT ["$hola"]