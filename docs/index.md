---
title: Home
layout: home
---

# FFmpeg in Docker

[![Docker Deploy](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/docker.yml/badge.svg)](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/docker.yml) [![Pages Deploy](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/pages.yml/badge.svg)](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/pages.yml)

FFmpeg compiled with additional libraries and running inside a Docker container. A RESTful API runs alongside written in Node.js utilsing `fluent-ffmpeg`.

## Exmaple

Get comand to the following enpoint `http://localhost/api/stream/rtmp/bars` with the JSON body

```json
{
    "address": "a.rtmp.youtube.com/live2",
    "key": "YOUTUBE_STREAM_KEY",
    "bitrate": "1000k",
    "line1": "Test RTMP Stream",
    "line2": "FFmpeg in Docker",
    "font": "swansea-bold.ttf"
}
```

This renders the following output.

<iframe width="560" height="315" src="https://www.youtube.com/embed/A7HQat68nfw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Try it with file inputs, decklink inputs and RIST, SRT or RTMP output.

## Pre-built Image

You can use the pre-built image straight away - however, this is contains pre-compiled FFmpeg as a result it does not have the following options enabled to comply with FFmpeg licensing;

-   `--enable-gpl`
-   `--enable-nonfree`
-   `--enable-libndi_newtek`
-   `--enable-decklink`

If this isn't a problem then you can get the image here;

`docker pull ghcr.io/ryanmccartney/ffmpeg-api:latest`

## Building

If you want to contribute to this project or you'd like some of the above features, you'll need to build a copy of this image yourself which will compile FFmpeg locally.

1. Clone the repository `git clone https://github.com/ryanmccartney/ffmpeg-docker`
2. Change directory to the repository `cd ./ffmpeg-docker`
3. Build the image using `docker compose build`.

### With Decklink Support

Before building you'll need to set the build argument variable `DECKLINK_SUPPORT` to `true`.

Additionally, you'll need to get a download link for the Blackmagic Design SDK from the [Blackmagic Website](https://www.blackmagicdesign.com/support/download/2438c76b9f734f69b4a914505e50a5ab/Linux).

It'll come in the form `https://sw.blackmagicdesign.com/DeckLink/v12.x.x/Blackmagic_DeckLink_SDK_12.x.x.zip?Key-Pair-Id=VALUE==&Expires=VALUE`

Then set the build argument variable `DEKSTOP_VIDEO_SDK_URL` to this url.

When running the container you'll then need to pass through the device. To do this;

1. Install Decklink Driver on your host machine.
2. Check device is connected and update any firmware
3. Determine the Blackmagic device mapping on the host. Expect something like - `dev/blackmagic/dv0`.

### With NDI Support

Using a [patch](https://framagit.org/tytan652/ffmpeg-ndi-patch) to re-add Newtec NDI to FFmpeg on building.

Before building you'll need to set the build argument variable `NDI_SUPPORT` to `true`.

-   Work in progress

## About

This software uses libraries from the FFmpeg project under the LGPLv2.1.

This software uses code of [FFmpeg](http://ffmpeg.org) licensed under the [LGPLv2.1](http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html) and its source can be downloaded [here](https://github.com/ryanmccartney/ffmpeg-docker)

### Media Passthrough

Mounting media from your host machine directly into the running container allows FFmpeg to scan and analyse it in the background. It can then be directly used when running FFmpeg commands.

Mount media in `/home/node/app/data/media` directory for use.
