---
layout: page
title: Endpoints
parent: Usage
nav_order: 2
---

# FFmpeg Docker API

Common FFMPEG fucntions from a RESTful API

## Version: 0.1.0

**Contact information:**  
Ryan McCarntney  
<https://ryan.mccartney.info/ffmpeg-docker>  
ryan@mccartney.info

**License:** [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)

---

### /bars/decklink

#### POST

##### Description

Takes a set of test Bars as an input and outputs it to a decklink card.

##### Parameters

| Name     | Located in | Description                                                                                              | Required | Schema  |
| -------- | ---------- | -------------------------------------------------------------------------------------------------------- | -------- | ------- |
| cardName | formData   | The name of the BMD Decklink cards. E.g - "DeckLink SDI"                                                 | Yes      | string  |
| font     | formData   | The name of the font file to use for text overlay. Must use the TrueType fonts. E.g - "swansea-bold.ttf" | Yes      | string  |
| offset   | formData   | Offset for time in hours. E.g 3, -3                                                                      | No       | number  |
| timecode | formData   | Show the timecode line - true,false                                                                      | No       | boolean |
| repeat   | formData   | Decides whether the media loops or not                                                                   | No       | boolean |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /file

#### POST

##### Description

Generate custom ident bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

#### GET

##### Description

Download file by name.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /bars/srt

#### POST

##### Description

SRT encode test bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /bars/rtmp

#### POST

##### Description

RTMP encode test bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /bars/udp

#### POST

##### Description

UDP encode test bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /bars/rtp

#### POST

##### Description

RTP encode test bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /bars/hls

#### POST

##### Description

HLS encode test bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

---

### /file

#### POST

##### Description

Generate custom ident bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

#### GET

##### Description

Download file by name.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /file/decklink

#### POST

##### Description

Takes a file as an input and outputs it to a decklink card.

##### Parameters

| Name     | Located in | Description                                                                                              | Required | Schema  |
| -------- | ---------- | -------------------------------------------------------------------------------------------------------- | -------- | ------- |
| filename | formData   | Filename and extension of media to playout. E.g - test.mp4                                               | Yes      | string  |
| cardName | formData   | The name of the BMD Decklink cards. E.g - "DeckLink SDI"                                                 | Yes      | string  |
| font     | formData   | The name of the font file to use for text overlay. Must use the TrueType fonts. E.g - "swansea-bold.ttf" | Yes      | string  |
| offset   | formData   | Offset for time in hours. E.g 3, -3                                                                      | No       | number  |
| timecode | formData   | Show the timecode line - true,false                                                                      | No       | boolean |
| repeat   | formData   | Decides whether the media loops or not                                                                   | No       | boolean |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /file/srt

#### POST

##### Description

SRT encode a file.

##### Parameters

| Name     | Located in | Description                                                                                              | Required | Schema  |
| -------- | ---------- | -------------------------------------------------------------------------------------------------------- | -------- | ------- |
| filename | formData   | Filename and extension of media to playout. E.g - test.mp4. Relative to ./data/media/                    | Yes      | string  |
| address  | formData   | Address to direct stream towards                                                                         | Yes      | string  |
| port     | formData   | Port to direct stream towards                                                                            | Yes      | number  |
| latency  | formData   | SRT latency in milliseconds, default is 250ms                                                            | No       | number  |
| bitrate  | formData   | The bitrate of the encoded stream in kilobits per second                                                 | Yes      | number  |
| font     | formData   | The name of the font file to use for text overlay. Must use the TrueType fonts. E.g - "swansea-bold.ttf" | No       | string  |
| offset   | formData   | Offset for time in hours. E.g 3, -3                                                                      | No       | number  |
| timecode | formData   | Show the timecode line - true,false                                                                      | No       | boolean |
| repeat   | formData   | Decides whether the media loops or not                                                                   | No       | boolean |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /file/udp

#### POST

##### Description

UDP encode a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /file/rtp

#### POST

##### Description

RTP encode a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /file/rtmp

#### POST

##### Description

RTMP encode a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /file/hls

#### POST

##### Description

HLS encode a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /file/list

#### GET

##### Description

Gets a list of files in the "./data/media" folder.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

---

### /decklink/file

#### POST

##### Description

Takes Decklink input in SDI and encodes it as a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /decklink/srt

#### POST

##### Description

Takes Decklink input in SDI and encodes it as SRT.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /decklink/udp

#### POST

##### Description

Takes Decklink input in SDI and encodes it as UDP.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /decklink/rtp

#### POST

##### Description

Takes Decklink input in SDI and encodes it as RTP.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /decklink/rtmp

#### POST

##### Description

Takes Decklink input in SDI and encodes it as RTMP.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /decklink/hls

#### POST

##### Description

Takes Decklink input in SDI and encodes it as HLS.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /decklink

#### GET

##### Description

Gets the info about currently attached Decklink cards

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

#### POST

##### Description

Sets the config for an individual Decklink card

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

---

### /file/metadata

#### GET

##### Description

Get the metadata in a media file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /playlist/:playlist

#### GET

##### Description

Get all the items in a playlist

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

#### POST

##### Description

Set all the items in a playlist

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /playlist/:playlist/add

#### POST

##### Description

Add a single file to the playlist.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /playlist/:playlist/remove

#### POST

##### Description

Add a single file to the playlist.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

---

### /clock

#### GET

##### Description

An HTML page with a live clock showing server time - suitable for latency measurements

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /jobs

#### GET

##### Description

An HTML page showing a simple job manager

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /chart

#### GET

##### Description

An HTML page showing VMAF test results as a chart

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

---

### /rtp/file

#### POST

##### Description

Takes an RTP input and turns it into a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /rtp/decklink

#### POST

##### Description

Takes an RTP input and outputs it to a decklink card.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

---

### /srt/file

#### POST

##### Description

Takes an SRT input and turns it into a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /srt/decklink

#### POST

##### Description

Takes an SRT input and outputs it to a decklink card.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

---

### /system/hello

#### GET

##### Description

Test route, API greets you in response.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /system/time

#### POST

##### Description

Set NTP server and sync.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

#### GET

##### Description

Get server time.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /system/stas

#### GET

##### Description

Get system stats; CPU, memory, etc.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /system/job/kill/all

#### POST

##### Description

Kill all running jobs

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /system/job/kill/:jobId

#### POST

##### Description

Kills a job by ID

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /system/job/all

#### GET

##### Description

Gets all jobs that are running

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /system/job/thumbnail/:jobId

#### GET

##### Description

Gets a thumnail for a job by it's Job ID

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /system/job/:jobId

#### GET

##### Description

Gets a job by ID

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

---

### /udp/decklink

#### POST

##### Description

Takes an UDP input and outputs it to a decklink card.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /udp/file

#### POST

##### Description

Takes an UDP input and outputs it to a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

---

### /vmaf/models

#### GET

##### Description

Returns a list of VMAF models.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /vmaf/test

#### POST

##### Description

Run a VMAF test specifing a reference file and test file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /vmaf/results/json

#### GET

##### Description

Get a VMAF results file as a JSON object.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /vmaf/results/csv

#### GET

##### Description

Get a VMAF results file as a CSV object.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /vmaf/results/download/csv

#### GET

##### Description

Get a VMAF results file as a CSV file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /vmaf/results/download/json

#### GET

##### Description

Get a VMAF results file in a downloadable JSON file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |
