---
layout: page
title: Decklink
nav_order: 3
has_children: false
---

# BMDDecklink

## FFMPEG Commands

Check Firmware status

`BlackmagicFirmwareUpdater status`

List Decklink devices

`ffmpeg -sources decklink`

List support formats

`ffmpeg -f decklink -list_formats 1 -i "DeckLink 4K Extreme 12G"`

File Playout

`ffmpeg -re -i /home/node/app/data/media/sushi-restaurant-loop.mp4 -pix_fmt uyvy422 -s 1920x1080 -ac 2 -f decklink -s 1920x1080 -pix_fmt uyvy422 "DeckLink 4K Extreme 12G"`

Bars Playout

`ffmpeg -re -f lavfi -i smptehdbars=rate=25:size=1920x1080 -t 10000 -pix_fmt uyvy422 -s 1920x1080 -f decklink -s 1920x1080 -pix_fmt uyvy422 "DeckLink 4K Extreme 12G"`

## Card Index Addressing
