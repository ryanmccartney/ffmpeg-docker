---
layout: page
title: Buidling
parent: Installation
nav_order: 2
---

# Building

There are two reasons to Build this project.

1. You'd like to use the Non Free FFMPEG library options
2. If you want to contribute to this project or you'd like some of the above features

In order to do either you'll need to build a copy of this image yourself which will compile FFmpeg locally.

1. Clone the repository `git clone https://github.com/ryanmccartney/ffmpeg-docker`
2. Change directory to the repository `cd ./ffmpeg-docker`
3. Build the image using `docker compose build`, adjusting the Build Arguements in the `docker-compose.yml` as neccessary or build using the docker build command directly. For example, `docker --build-arg FFMPEG_VERSION=5.0 --build-arg NON_FREE=true --build-arg DECKLINK_SUPPORT=true --build-arg DECLINK_SDK_URL=https://urlhere --build-arg DECKLINK_DRIVER_URL=https://urlhere --build-arg DECKLINK_DRIVER_VERSION=12.4.1 .`

## Build Arguments

| Argument                | Default | Type    | Description                                                 |
| ----------------------- | ------- | ------- | ----------------------------------------------------------- |
| FFMPEG_VERSION          | 5.0     | String  | Version of FFMPEG to Checkout and compile image with        |
| NON_FREE                | false   | Boolean | Build the image with Non Free options, not for distrubution |
| DECKLINK_SUPPORT        | false   | Boolean | Build the image with Decklink Support                       |
| DECLINK_SDK_URL         | N/A     | String  | If Decklink support is required, this URL must be passed    |
| DECKLINK_DRIVER_URL     | N/A     | String  | If Decklink support is required, this URL must be passed    |
| DECKLINK_DRIVER_VERSION | 12.4.1  | String  | Version should match that of the URLs aboved                |
| NDI_SUPPORT             | false   | Boolean | Build the image with NDI Support                            |
| NDI_SDK_URL             | N/A     | Boolean | If NDI support is required, this URL must be passed         |

## Non Free Options

To stay compliant with FFMPEG licensing the following libraries are not included in the distrubuted version of FFMPEG;

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
