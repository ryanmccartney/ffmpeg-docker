[![Docker Deploy](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/docker.yml/badge.svg)](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/docker.yml) [![Pages Deploy](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/pages.yml/badge.svg)](https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/pages.yml)

# FFMPEG in Docker

FFMPEG compiled with additional libraries and running inside a Docker container. A RESTful API runs alongside written in Node.js utilsing `fluent-ffmpeg`.

For more informations read the [documentation](https://ryan.mccartney.info/ffmpeg-docker/).

## Installation

`docker pull ghcr.io/ryanmccartney/ffmpeg-api:latest`

### With Decklink Support

1. Install Decklink Driver on your host machine.
2. Check device is connected and update any firmware
3. Determine the Blackmagic device mapping on the host. Expect something like - `dev/blackmagic/dv0`.
