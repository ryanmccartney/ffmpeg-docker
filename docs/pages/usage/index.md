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

All commands that run FFMPEG processes in the container are POST requests. They have a common body format for passing arguments with specific variables that are aplicable to indicudual codecs and input/output types
Common body options for all these media proccessing endpoints shown as follows;

```json
{
    "input": {
        "inputVariable1": "specifically applies to chosen input type",
        "inputVariable2": "specifically applies to chosen input type"
    },
    "output": {
        "outputVariable1": "specifically applies to chosen output type",
        "outputVariable2": "specifically applies to chosen output type"
    },
    "overlay": {
        "fontSize": 90,
        "line1": "Line 1 Text",
        "line2": "Line 2 Text",
        "timecode": true,
        "font": "swansea-bold.ttf",
        "offset": 1,
        "topRight": {
            "line1": "%{pts\\:hms}",
            "line2": "Frame %{n}"
        }
    },
    "thumbnail": {
        "frequency": 25
    }
}
```

## Media

Media can be added into the container at `home/node/app/data/media`. This can then be called relative to this directory.

For example `home/node/app/data/media/test.mp4` can be called using the `file` parameter in a request body as `test.mp4`.
