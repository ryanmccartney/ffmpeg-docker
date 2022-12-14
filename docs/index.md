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

## Installation

`docker pull ghcr.io/ryanmccartney/ffmpeg-api:latest`

### Media Passthrough

Mounting media from your host machine directly into the running container allows FFmpeg to scan and analyse it in the background. It can then be directly used when running FFmpeg commands.

Mount media in `/home/node/app/data/media` directory for use.

### With Decklink Support

1. Install Decklink Driver on your host machine.
2. Check device is connected and update any firmware
3. Determine the Blackmagic device mapping on the host. Expect something like - `dev/blackmagic/dv0`.

```

```
