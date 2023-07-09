---
layout: page
title: Endpoints
parent: Usage
nav_order: 1
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
| 200 | Success |

### /decklink/:cardIndex

#### GET
##### Description

Gets the config for an individual Decklink card

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

#### POST
##### Description

Sets the config for an individual Decklink card

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/:cardIndex/file

#### GET
##### Description

Sends a file to a decklink output

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| filename | formData | Filename and extension of media to playout. E.g - test.mp4 | Yes | string |
| cardName | formData | The name of the BMD Decklink cards. E.g - "DeckLink SDI" | Yes | string |
| font | formData | The name of the font file to use for text overlay. Must use the TrueType fonts. E.g - "swansea-bold.ttf" | Yes | string |
| offset | formData | Offset for time in hours. E.g 3, -3 | No | number |
| timecode | formData | Show the timecode line - true,false | No | boolean |
| repeat | formData | Decides whether the media loops or not | No | boolean |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/:cardIndex/record

#### GET
##### Description

Record the input of a decklink card index to file

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| cardName | formData | The name of the BMD Decklink cards. E.g - "DeckLink SDI" | Yes | string |
| font | formData | The name of the font file to use for text overlay. Must use the TrueType fonts. E.g - "swansea-bold.ttf" | Yes | string |
| offset | formData | Offset for time in hours. E.g 3, -3 | No | number |
| timecode | formData | Show the timecode line - true,false | No | boolean |
| repeat | formData | Decides whether the media loops or not | No | boolean |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/:cardIndex/hls

#### GET
##### Description

Converts the input of a decklink card index to hls

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/:cardIndex:/srt

#### GET
##### Description

Converts the input of a decklink card index to hls

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/:cardIndex/bars

#### GET
##### Description

Sends some SMPTE bars to a decklink output

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/:cardIndex/thumbnail

#### GET
##### Description

Get thumbnail of the decklink output

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/:cardIndex/stop

#### GET
##### Description

Stops the decklink output on a particular index

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/:cardIndex/pause

#### GET
##### Description

Pauses the decklink output on a particular index

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

---
### /file/metadata

#### GET
##### Description

Get the metadata in a media file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /file/bars

#### GET
##### Description

Generate custom ident bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /file/download

#### GET
##### Description

Download file by name.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

---
### /stream/srt/file

#### GET
##### Description

SRT Stream a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /stream/rtmp/file

#### GET
##### Description

RTMP Stream a file.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /stream/srt/bars

#### GET
##### Description

SRT Stream test bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /stream/rtmp/bars

#### GET
##### Description

RTMP Stream test bars.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

---
### /system/hello

#### GET
##### Description

Test route, API greets you in response.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /system/time

#### POST
##### Description

Set NTP server and sync.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

#### GET
##### Description

Get server time.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |
