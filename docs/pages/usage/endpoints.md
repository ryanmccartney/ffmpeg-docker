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

### /decklink

#### GET

##### Description

Gets the info about currently attached Decklink cards

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /decklink/:cardIndex

#### GET

##### Description

Gets the config for an individual Decklink card

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

### /decklink/:cardIndex/file

#### GET

##### Description

Sends a file to a decklink output

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

### /decklink/:cardIndex/audio

#### GET

##### Description

Sends an audio file to a decklink output

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

### /decklink/:cardIndex/record

#### GET

##### Description

Record the input of a decklink card index to file

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

### /decklink/:cardIndex/bars

#### GET

##### Description

Sends some SMPTE bars to a decklink output

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /decklink/:cardIndex/stop

#### GET

##### Description

Stops the decklink output on a particular index

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /decklink/:cardIndex/pause

#### GET

##### Description

Pauses the decklink output on a particular index

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

---

### /decode/srt/file

#### GET

##### Description

Takes an SRT input and turns it into a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /decode/srt/decklink

#### GET

##### Description

Takes an SRT input and turns it into a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

---

### /encode/file/srt

#### GET

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

### /encode/file/udp

#### GET

##### Description

UDP encode a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /encode/file/rtmp

#### GET

##### Description

RTMP encode a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /encode/bars/srt

#### GET

##### Description

SRT encode test bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /encode/bars/rtmp

#### GET

##### Description

RTMP encode test bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /encode/bars/udp

#### GET

##### Description

UDP encode test bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /encode/decklink/srt

#### GET

##### Description

Takes Decklink input in SDI and encodes it as SRT.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /encode/decklink/rtmp

#### GET

##### Description

Takes Decklink input in SDI and encodes it as RTMP.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /encode/decklink/hls

#### GET

##### Description

Takes Decklink input in SDI and encodes it as HLS.

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

### /file/bars

#### GET

##### Description

Generate custom ident bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /file/download

#### GET

##### Description

Download file by name.

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

#### GET

##### Description

Add a single file to the playlist.

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

### /system/job/kill/all

#### GET

##### Description

Kill all running jobs

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /system/job/kill/:jobId

#### GET

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

### /system/job

#### GET

##### Description

An HTML page with a simple job manager

##### Responses

| Code | Description |
| ---- | ----------- |
| 200  | Success     |

### /system/clock

#### GET

##### Description

An HTML page with a live clock showing server time - suitable for latency measurements

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

#### GET

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
