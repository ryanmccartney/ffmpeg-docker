---
layout: page
title: Installation
nav_order: 2
has_children: true
---

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