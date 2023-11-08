---
title: Home
layout: home
nav_order: 1
---

# FFmpeg in Docker

[![Docker Deploy](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/docker.yml/badge.svg)](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/docker.yml) [![Pages Deploy](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/pages.yml/badge.svg)](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/pages.yml)

FFmpeg compiled with additional libraries and running inside a Docker container. A RESTful API runs alongside written in Node.js utilsing `fluent-ffmpeg`.

## Exmaple

`POST` comand to the following endpoint `http://localhost/api/bars/rtmp` with the JSON body

```json
{
    "input": {
        "type": "smptehdbars"
    },
    "output": {
        "address": "a.rtmp.youtube.com/live2",
        "key": "YOUTUBE_STREAM_KEY",
        "bitrate": "10M"
    },
    "overlay": {
        "line1": "Test RTMP Stream",
        "line2": "FFmpeg in Docker",
        "font": "swansea-bold.ttf"
    },
    "thumbnail": true
}
```

This renders the following output.

<iframe width="560" height="315" src="https://www.youtube.com/embed/A7HQat68nfw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Try it with file inputs, decklink inputs and RIST, SRT or RTMP output.

## Pre-built Image

You can use the pre-built image straight away - however, this is contains pre-compiled FFmpeg as a result it does not have the following options enabled to comply with FFmpeg licensing;

-   `--enable-nonfree`
-   `--enable-libndi_newtek`
-   `--enable-decklink`
-   `--enable-libsrt`
-   `--disable-libaom`
-   `--disable-libsvtav1`
-   `--enable-libklvanc`
-   `--enable-libvmaf`
-   `--enable-libfdk-aac`

If this isn't a problem then you can get the image here;

`docker pull ghcr.io/ryanmccartney/ffmpeg-docker:latest`

## Future Work

-   SRT/RIST statistics - unavalible in FFmpeg, so dificult to report SRT information like, maxRTT, recovered packets, lost packets, jitter, etc.
-   SRT Bonding - SRT v1.5 supports bonding through socket groups, again this is not implemented in FFmpeg

## About

This software uses libraries from the FFmpeg project under the LGPLv2.1.

This software uses code of [FFmpeg](http://ffmpeg.org) licensed under the [LGPLv2.1](http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html) and its source can be downloaded [here](https://github.com/ryanmccartney/ffmpeg-docker)

### Media Passthrough

Mounting media from your host machine directly into the running container allows FFmpeg to scan and analyse it in the background. It can then be directly used when running FFmpeg commands.

Mount media in `/home/node/app/data/media` directory for use.
