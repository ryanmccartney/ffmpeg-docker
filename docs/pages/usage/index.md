---
layout: page
title: Usage
nav_order: 4
has_children: true
---

# Usage

The image provides a RESTful API exposing a number of endpoints allowing you to perform common functions on media.

## Endpoints

* `api/decklink`
* `api/file`
* `api/stream`
* `api/system`
* `api/hls`

## Media

Media can be added into the container at `home/node/app/data/media`. This can then be called relative to this directory. 

For example `home/node/app/data/media/test.mp4` can be called using the `filename` parameter in a request body as `test.mp4`.


