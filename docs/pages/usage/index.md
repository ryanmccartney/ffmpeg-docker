---
layout: page
title: Usage
nav_order: 4
has_children: true
---

# Usage

The image provides a RESTful API exposing a number of endpoints allowing you to perform common functions on media.

## Endpoints

-   `api/vmaf` - For running VMAF tests on files and obtaining the results
-   `api/system` - For obtaining system stats and status of running jobs
-   `api/INPUT/OUTPUT` - For processing media, the api takes the following format

`INPUT` options include;

-   `file`
-   `decklink`
-   `hls`
-   `udp`
-   `rtp`
-   `srt`
-   `bars`

`OUTPUT` options include;

-   `file`
-   `decklink`
-   `hls`
-   `udp`
-   `rtp`
-   `srt`
-   `bars`
-   `rtmp`

Common body options for all these media proccessing endpoints include;

```
{
    "bitrate": "30M",
    "thumbnail": true,
    "fontSize": 90,
    "filename": "blue-sky.mov",
    "line1": "Line 1 Text",
    "line2": "Line 2 Text",
    "timecode": true,
    "font": "swansea-bold.ttf",
    "offset": 1,
    "topRight": {
        "line1": "%{pts\\:hms}",
        "line2": "Frame %{n}"
    }
}
```

## Media

Media can be added into the container at `home/node/app/data/media`. This can then be called relative to this directory.

For example `home/node/app/data/media/test.mp4` can be called using the `filename` parameter in a request body as `test.mp4`.
