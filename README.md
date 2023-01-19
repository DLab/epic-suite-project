# EPIc Suite GUI

 EPIc Suite is an open source pandemic modeling application. This project is executed by the Computational Biology Laboratory of Fundacion Ciencia & Vida, which is funded by the AFOSR project Number FA9550-20-1-0196.

 This repository contains the EPIc Suite GUI.

## Deploy instructions (internal use)

### Local build
1. Pull new changes: `git pull`
2. Build new Docker image: `docker build -t epic-suite-gui:mvp .` 
3. Save Docker image in tarball: `docker save -o epic-suite-gui.tar epic-suite-gui:mvp`
4. Send tarball to Hydra through SCP: `scp epic-suite-gui.tar hydra@hydra:/home/hydra`
5. Load Docker image in server: `docker load -i epic-suite-gui.tar`
6. Stop and remove previous instance of the container: `docker stop epic-suite-gui && docker rm epic-suite-gui`
7. Start new instance of the GUI: `docker run -d --name epic-suite-gui -p 3000:3000 --restart=always epic-suite-gui:mvp`

### Remote build at Hydra
1. Pull new changes: `git pull`
2. Build new Docker image: `docker build -t epic-suite-gui:mvp .` 
3. Stop and remove previous instance of the container: `docker stop epic-suite-gui && docker rm epic-suite-gui`
4. Start new instance of the GUI: `docker run -d --name epic-suite-gui -p 3000:3000 --restart=always epic-suite-gui:mvp`


## Sources

`Dockerfile` sourced from [Next.js repository](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile)
