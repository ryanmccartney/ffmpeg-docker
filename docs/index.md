---
title: Home
layout: home
---

# FFMPEG in Docker

[![Docker Deploy](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/docker.yml/badge.svg)](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/docker.yml) [![Pages Deploy](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/pages.yml/badge.svg)](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/pages.yml)

FFMPEG compiled with additional libraries and running inside a Docker container. A RESTful API runs alongside written in Node.js utilsing `fluent-ffmpeg`.

## Installation

`docker pull ghcr.io/ryanmccartney/ffmpeg-api:latest`

### Media Passthrough

Mounting media from your host machine directly into the running container allows FFMPEG to scan and analyse it in the background. It can then be directly used when running FFMPEG commands.

Mount media in `/home/node/app/data/media` directory for use.

### With Decklink Support

1. Install Decklink Driver on your host machine.
2. Check device is connected and update any firmware
3. Determine the Blackmagic device mapping on the host. Expect something like - `dev/blackmagic/dv0`.
