---
layout: page
title: Decklink
nav_order: 3
has_children: false
---

# BMDDecklink

## FFMPEG Commands

### Check Firmware status

`BlackmagicFirmwareUpdater status`

### List Decklink devices

`ffmpeg -sources decklink`

### List support formats

`ffmpeg -f decklink -list_formats 1 -i "DeckLink 4K Extreme 12G"`

### File Playout

`ffmpeg -re -i /home/node/app/data/media/sushi-restaurant-loop.mp4 -pix_fmt uyvy422 -s 1920x1080 -ac 2 -f decklink -s 1920x1080 -pix_fmt uyvy422 "DeckLink 4K Extreme 12G"`

### Bars Playout

`ffmpeg -re -f lavfi -i smptehdbars=rate=25:size=1920x1080 -t 10000 -pix_fmt uyvy422 -s 1920x1080 -f decklink -s 1920x1080 -pix_fmt uyvy422 "DeckLink 4K Extreme 12G"`

Bars Types

From the FFMPEG documentation;

* The `allrgb` source returns frames of size 4096x4096 of all rgb colors.
* The `allyuv` source returns frames of size 4096x4096 of all yuv colors.
* The `color` source provides an uniformly colored input.
* The `colorchart` source provides a colors checker chart.
* The `colorspectrum` source provides a color spectrum input.
* The `haldclutsrc` source provides an identity Hald CLUT. See also haldclut filter.
* The `nullsrc` source returns unprocessed video frames. It is mainly useful to be employed in analysis / debugging tools, or as the source for filters which ignore the input data.
* The `pal75bars` source generates a color bars pattern, based on EBU PAL recommendations with 75% color levels.
* The `pal100bars` source generates a color bars pattern, based on EBU PAL recommendations with 100% color levels.
* The `rgbtestsrc` source generates an RGB test pattern useful for detecting RGB vs BGR issues. You should see a red, green and blue stripe from top to bottom.
* The `smptebars` source generates a color bars pattern, based on the SMPTE Engineering Guideline EG 1-1990.
* The `smptehdbars` source generates a color bars pattern, based on the SMPTE RP 219-2002.
* The `testsrc` source generates a test video pattern, showing a color pattern, a scrolling gradient and a timestamp. This is mainly intended for testing purposes.
* The `testsrc2` source is similar to testsrc, but supports more pixel formats instead of just rgb24. This allows using it as an input for other tests without requiring a format conversion.
* The `yuvtestsrc` source generates an YUV test pattern. You should see a y, cb and cr stripe from top to bottom.

## Card Index Addressing


## Simple Decklink Capture

Capture raw

`ffmpeg -f decklink -video_input 'sdi' -i 'DeckLink SDI' -acodec copy -vcodec copy ./media/test1.avi`

Let's make the file smaller

`ffmpeg -f decklink -i 'DeckLink SDI' -c:v libx264 -crf 23 -preset medium ./media/test2.mp4`

## Low latency HLS to browser

`ffmpeg -f decklink -i 'DeckLink SDI' -c:v libx264 -preset ultrafast -tune zerolatency -g 30 -c:a aac -strict experimental -movflags faststart -f hls -hls_time 0.5 -hls_list_size 5 -hls_flags independent_segments output.m3u8`

## Decklink input to Waveform

`ffmpeg -f decklink -i 'DeckLink SDI' -vf "waveform" -pix_fmt yuv420p -c:v libx264 -preset medium -crf 18 output.mp4`

