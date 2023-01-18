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

## About

This software uses libraries from the FFmpeg project under the LGPLv2.1.

This software uses code of [FFmpeg](http://ffmpeg.org) licensed under the [LGPLv2.1](http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html) and its source can be downloaded [here](https://github.com/ryanmccartney/ffmpeg-docker)

### Media Passthrough

Mounting media from your host machine directly into the running container allows FFmpeg to scan and analyse it in the background. It can then be directly used when running FFmpeg commands.

Mount media in `/home/node/app/data/media` directory for use.
