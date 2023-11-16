---
layout: page
title: Buidling
parent: Installation
nav_order: 2
---

# Building

There are two reasons to Build this project.

1. You'd like to use the Non Free FFmpeg library options
2. If you want to contribute to this project or you'd like some of the above features

In order to do either you'll need to build a copy of this image yourself which will compile FFmpeg locally.

1. Clone the repository `git clone https://github.com/ryanmccartney/ffmpeg-docker`
2. Change directory to the repository `cd ./ffmpeg-docker`
3. Build the image using `docker compose build`, adjusting the Build Arguements in the `docker-compose.yml` as neccessary or build using the docker build command directly. For example, `docker --build-arg FFMPEG_VERSION=5.0 --build-arg NON_FREE=true --build-arg DECKLINK_SUPPORT=true --build-arg DECKLINK_SDK_URL=https://urlhere --build-arg DECKLINK_DRIVER_URL=https://urlhere --build-arg DECKLINK_DRIVER_VERSION=12.4.1 .`

## Build Arguments

| Argument                | Default | Type    | Description                                                 |
| ----------------------- | ------- | ------- | ----------------------------------------------------------- |
| FFMPEG_VERSION          | 5.0     | String  | Version of FFMPEG to Checkout and compile image with        |
| NON_FREE                | false   | Boolean | Build the image with Non Free options, not for distrubution |
| DECKLINK_SUPPORT        | false   | Boolean | Build the image with Decklink Support                       |
| DECKLINK_SDK_URL        | N/A     | String  | If Decklink support is required, this URL must be passed    |
| DECKLINK_DRIVER_URL     | N/A     | String  | If Decklink support is required, this URL must be passed    |
| DECKLINK_DRIVER_VERSION | 12.4.1  | String  | Version should match that of the URLs aboved                |
| NDI_SUPPORT             | false   | Boolean | Build the image with NDI Support                            |
| NDI_SDK_URL             | N/A     | Boolean | If NDI support is required, this URL must be passed         |

## Non Free Options

To stay compliant with FFmpeg licensing the following libraries are not included in the distrubuted version of FFmpeg;

-   `--enable-nonfree`
-   `--enable-libndi_newtek`
-   `--enable-decklink`
-   `--enable-libsrt`
-   `--disable-libaom`
-   `--disable-libsvtav1`
-   `--enable-libklvanc`
-   `--enable-libvmaf`
-   `--enable-libfdk-aac`

If you believe a library has been included in the build distrubuted version in error please get in contact.

## Production

For production you should make sure that the source code is not mounted into the container. If the NODE_ENV option is set it should be set to `production`. This is the default if it is not set.

### Command Line

```
docker buildx build --build-arg NON_FREE=true --platform=linux/amd64 -t ffmpeg-docker:latest .
```

### Docker Compose

A sample `docker-compose.yml` file for production is shown below;

```
# NAME: docker-compose.yml
# AUTH: Ryan McCartney <ryan@mccartney.info>
# DATE: 30/10/2023
# DESC: FFmpeg compiled with configurable options link BMD Decklink

version: "3.8"

services:
    ffmpeg:
        container_name: ffmpeg
        network_mode: "host"
        build:
            context: "."
            args:
                DECKLINK_SUPPORT: "true"
                DECKLINK_SDK_URL: "decklinkurlhere"
                DECKLINK_DRIVER_URL: "decklinkurlhere"
                DECKLINK_DRIVER_VERSION: "12.4.1"
                NON_FREE: "true"
        restart: always
        volumes:
            - ./data:/home/node/app/data
        devices:
            - /dev/blackmagic/io0:/dev/blackmagic/io0
        environment:
            PORT: 80
            WEB_GUI: "true"
        ports:
            - 80:80

```

## Development

For development you'll need to locally install the NPM packages and pass through the source code folder to the

1. Change directory to the repository `cd ./ffmpeg-docker`
2. Locally install the NPM packages using `npm i`
3. Ensure the source could is mounted as a bind volume in the `docker-compose.yml` file as shown below;

```
        volumes:
            - ./:/home/node/app
```
