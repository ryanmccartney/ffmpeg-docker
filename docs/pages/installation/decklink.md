---
title: BMD Decklink
layout: installation
---

# Decklink Support

# Host Machine

To use the decklink device you'll need to have the correct drivers installed on your host machine.

You can use the script in this repository to do this;

* `chmod +x setup.sh`
* `./setup.sh`

# Building

Before building you'll need to set the build argument variable `DECKLINK_SUPPORT` to `true`.

Additionally, you'll need to get a download link for the Blackmagic Design SDK from the [Blackmagic Website](https://www.blackmagicdesign.com/support/download/2438c76b9f734f69b4a914505e50a5ab/Linux).

It'll come in the form `https://sw.blackmagicdesign.com/DeckLink/v12.x.x/Blackmagic_DeckLink_SDK_12.x.x.zip?Key-Pair-Id=VALUE==&Expires=VALUE`

Then set the build argument variable `DEKSTOP_VIDEO_SDK_URL` to this url.

When running the container you'll then need to pass through the device. To do this;

1. Install Decklink Driver on your host machine.
2. Check device is connected and update any firmware
3. Determine the Blackmagic device mapping on the host. Expect something like - `dev/blackmagic/dv0`.
