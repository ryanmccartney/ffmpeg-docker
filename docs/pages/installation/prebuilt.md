---
layout: page
title: Pre Built Image
parent: Installation
nav_order: 1
---

At this point you've either built the image from scratch, pulled it from and internal repository or the public options have the suitable options for your requirements.

## Pulling the Image

You can pull the public image with the following command

```
docker pull ghcr.io/ryanmccartney/ffmpeg-docker:latest
```

## Running the Image

For production you should make sure that the source code is not mounted into the container. If the NODE_ENV option is set it should be set to `production`. This is the default if it is not set.

### Docker Standalone

You can run the container with the prebuilt image just pulled using the following commands;

```
docker run -d\
 --network host\
 --volume ffmpeg-docker-data:/home/node/app/data\
 --env PORT=80\
 --env WEB_GUI=true\
 --env NODE_ENV=production\
 ghcr.io/ryanmccartney/ffmpeg-docker:latest
```

### Docker Compose

A sample `docker-compose.yml` file for production is shown below;

```
# NAME: docker-compose.yml
# AUTH: Ryan McCartney <ryan@mccartney.info>
# DATE: 30/10/2023
# DESC: Run ffmpeg-docker prebuilt version

version: "3.8"

services:
    ffmpeg:
        image: ghcr.io/ryanmccartney/ffmpeg-docker:latest
        restart: always
        volumes:
            - ./data:/home/node/app/data
        environment:
            PORT: 80
            WEB_GUI: "true"
            NODE_ENV: "production"
        network_mode: "host"
```

Paste this into a file called `docker-compose.yml`

Finally run it with `docker compose up -d`.
