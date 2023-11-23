/*
FFmpeg Docker, an API wrapper around FFmpeg running in a configurable docker container
Copyright (C) 2022 Ryan McCartney

This file is part of the FFmpeg Docker (ffmpeg-docker).

FFmpeg Docker is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

"use strict";

const router = require("express").Router();
const { checkSchema, validationResult } = require("express-validator");
const hashResponse = require("@utils/hash-response");
const path = require("path");

const audioDecklink = require("@services/audio-decklink");
const audioUdp = require("@services/audio-udp");
const audioRtp = require("@services/audio-rtp");
const audioSrt = require("@services/audio-srt");
const audioRtmp = require("@services/audio-rtmp");
const audioHls = require("@services/audio-hls");

const overlayValidator = require("@validators/overlay");
const thumbnailValidator = require("@validators/thumbnail");
const decklinkValidator = require("@validators/decklink");
const audioValidator = require("@validators/audio");
const hlsValidator = require("@validators/hls");
const srtValidator = require("@validators/srt");
const rtmpValidator = require("@validators/rtmp");
const udpValidator = require("@validators/udp");
const rtpValidator = require("@validators/rtp");

const fileMetadata = require("@services/file-metadata");
const fileList = require("@services/file-list");

/**
 * @swagger
 * /audio/decklink:
 *    post:
 *      description: Takes an audio file as an input and outputs it to a decklink card.
 *      tags: [audio]
 *      parameters:
 *        - in: formData
 *          name: file
 *          type: string
 *          description: Filename and extension of media to playout. E.g - test.mp4
 *          required: true
 *        - in: formData
 *          name: cardName
 *          type: string
 *          description: The name of the BMD Decklink cards. E.g - "DeckLink SDI"
 *          required: true
 *        - in: formData
 *          name: font
 *          type: string
 *          description: The name of the font audio to use for text overlay. Must use the TrueType fonts. E.g - "swansea-bold.ttf"
 *          required: font
 *        - in: formData
 *          name: offset
 *          type: number
 *          description: Offset for time in hours. E.g 3, -3
 *          required: false
 *        - in: formData
 *          name: timecode
 *          type: boolean
 *          description: Show the timecode line - true,false
 *          required: false
 *        - in: formData
 *          name: repeat
 *          type: boolean
 *          description: Decides whether the media loops or not
 *          required: false
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/decklink",
    checkSchema({
        ...audioValidator("input"),
        ...decklinkValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await audioDecklink(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /audio/srt:
 *    post:
 *      description: SRT encode an audio file.
 *      tags: [audio]
 *      parameters:
 *       - in: formData
 *         name: file
 *         type: string
 *         description: Filename and extension of media to playout. E.g - test.mp4. Relative to ./data/media/
 *         required: true
 *       - in: formData
 *         name: address
 *         type: string
 *         description: Address to direct stream towards
 *         required: true
 *       - in: formData
 *         name: port
 *         type: number
 *         description: Port to direct stream towards
 *         required: true
 *       - in: formData
 *         name: latency
 *         type: number
 *         description: SRT latency in milliseconds, default is 250ms
 *         required: false
 *       - in: formData
 *         name: bitrate
 *         type: number
 *         description: The bitrate of the encoded stream in kilobits per second
 *         required: true
 *       - in: formData
 *         name: font
 *         type: string
 *         description: The name of the font audio to use for text overlay. Must use the TrueType fonts. E.g - "swansea-bold.ttf"
 *         required: false
 *       - in: formData
 *         name: offset
 *         type: number
 *         description: Offset for time in hours. E.g 3, -3
 *         required: false
 *       - in: formData
 *         name: timecode
 *         type: boolean
 *         description: Show the timecode line - true,false
 *         required: false
 *       - in: formData
 *         name: repeat
 *         type: boolean
 *         description: Decides whether the media loops or not
 *         required: false
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/srt",
    checkSchema({
        ...audioValidator("input"),
        ...srtValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await audioSrt(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /audio/udp:
 *    post:
 *      description: UDP encode an audio file.
 *      tags: [audio]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/udp",
    checkSchema({
        ...audioValidator("input"),
        ...udpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await audioUdp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /audio/rtp:
 *    post:
 *      description: RTP encode an audio file.
 *      tags: [audio]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/rtp",
    checkSchema({
        ...audioValidator("input"),
        ...rtpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await audioRtp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /audio/rtmp:
 *    post:
 *      description: RTMP encode an audio file.
 *      tags: [audio]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/rtmp",
    checkSchema({
        ...audioValidator("input"),
        ...rtmpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await audioRtmp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /audio/hls:
 *    post:
 *      description: HLS encode an audio file.
 *      tags: [audio]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/hls",
    checkSchema({
        ...audioValidator("input"),
        ...hlsValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await audioHls(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /audio/metadata:
 *    get:
 *      description: Get the metadata in a median audio file.
 *      tags: [audios]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: formData
 *          name: file
 *          type: string
 *          description: The file including extension in the `./data/media` directory
 *          required: false
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/metadata", async (req, res, next) => {
    const response = await fileMetadata(req.body.file);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /audio/list:
 *    get:
 *      description: Gets a list of audio files in the "./data/media" folder.
 *      tags: [audio]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: formData
 *          name: extension
 *          type: boolean
 *          description: Includes the file extension in the returned name
 *          required: false
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/list", async (req, res, next) => {
    const response = await fileList(req.body);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /audio:
 *    get:
 *      description: Download audio by name.
 *      tags: [audio]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/", async (req, res, next) => {
    const audioPath = path.join(__dirname, "..", "data", "media", req.query.file);
    res.download(audioPath);
});

module.exports = router;
