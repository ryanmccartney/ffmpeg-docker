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
### /decklink/info

#### GET
##### Description

Gets the info about currently attached Decklink cards

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/cardIndex

#### GET
##### Description

Sets the config for an individual Decklink card

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/:cardIndex:/file

#### GET
##### Description

Sends a file to a decklink output

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/:cardIndex:/recod

#### GET
##### Description

Converts the input of a decklink card index to hls

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/bars

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

### /decklink/stop

#### GET
##### Description

Stops the decklink output on a particular index

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Success |

### /decklink/pause

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
