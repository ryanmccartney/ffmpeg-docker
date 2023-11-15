<h1 align="center">
    FFmpeg in Docker
</h1>

<p align="center">
  <i align="center">Confiugrable FFmpeg in a docker container with a simple RESTful API</i>
</p>

<h4 align="center">
  <a href="https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/docker.yml">
    <img src="https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/docker.yml/badge.svg" alt="continuous integration">
  </a>

  <a href="https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/pages.yml">
    <img src="https://github.com/ryanmccartney/ffmpeg-docker/actions/workflows/pages.yml/badge.svg" alt="continuous integration">
  </a>

  <a href="https://github.com/ryanmccartney/ffmpeg-docker/graphs/contributors">
    <img src="https://img.shields.io/github/contributors-anon/ryanmccartney/ffmpeg-docker?color=yellow&style=plastic" alt="contributors">
  </a>
  <a href="https://opensource.org/license/gpl-3-0">
    <img src="https://img.shields.io/badge/GNU%20GPL%20v3.0-blue.svg?style=plastic&label=license" alt="license">
  </a>
</h4>

FFmpeg compilation made easy with additional libraries and runs inside a Docker container. A RESTful API runs alongside written in Node.js utilising `express` and `fluent-ffmpeg`.

For more information read the [documentation](https://ryan.mccartney.info/ffmpeg-docker/).

:exclamation: This project is a work in progress, it is still in the early stages of development and functions may not work as expected.

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

## Building

If you want to contribute to this project or you'd like some of the above features, you'll need to build a copy of this image yourself which will compile FFmpeg locally.

1. Clone the repository `git clone https://github.com/ryanmccartney/ffmpeg-docker`
2. Change directory to the repository `cd ./ffmpeg-docker`
3. Build the image using `docker compose build`.

### on an M1 Mac

1. Install your packages locally - `npm install --platform=linux --arch=arm64v8 sharp`

## About

This software uses libraries from the FFmpeg project under the LGPLv2.1.

This software uses code of [FFmpeg](http://ffmpeg.org) licensed under the [LGPLv2.1](http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html) and its source can be downloaded [here](https://github.com/ryanmccartney/ffmpeg-docker)
