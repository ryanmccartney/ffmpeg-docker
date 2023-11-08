---
layout: page
title: Newtec NDI
parent: Installation
nav_order: 2
---

# NDI Support

NDI is not supported by FFmpeg as of 2018 due to [licensing issues](https://trac.ffmpeg.org/ticket/7589).

Howevever, a [patch](https://framagit.org/tytan652/ffmpeg-ndi-patch) exists to readd the relevant code to the FFmpeg source - created by [tytan652](https://tytan652.frama.io/).

## Building

To enable NDI inside the container you'll need to set the build argument variable `NDI_SUPPORT` to `true` before building.

This will download the NDI SDK, unpack it and set the enable flag for NDI in the FFmpeg build configuration.

## Sample Commands

`ffmpeg -i test.mp4 -vf format=rgb32 -c:v libndi_newtek -pix_fmt uyvy422 -f libndi_newtek "NDI Test Stream"`
