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

const fileDecklink = require("@services/file-decklink");
const fileUdp = require("@services/file-udp");
const fileRtp = require("@services/file-rtp");
const fileSrt = require("@services/file-srt");
const fileRtmp = require("@services/file-rtmp");
const fileHls = require("@services/file-hls");

const fileMetadata = require("@services/file-metadata");
const fileList = require("@services/file-list");
const fileUpload = require("@utils/file-upload");

const overlayValidator = require("@validators/overlay");
const thumbnailValidator = require("@validators/thumbnail");
const decklinkValidator = require("@validators/decklink");
const fileValidator = require("@validators/file");
const hlsValidator = require("@validators/hls");
const srtValidator = require("@validators/srt");
const rtmpValidator = require("@validators/rtmp");
const udpValidator = require("@validators/udp");
const rtpValidator = require("@validators/rtp");
const { response } = require("express");

/**
 * @swagger
 * /file/decklink:
 *    post:
 *      description: Takes a file as an input and outputs it to a decklink card.
 *      tags: [file]
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
 *          description: The name of the font file to use for text overlay. Must use the TrueType fonts. E.g - "swansea-bold.ttf"
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
        ...fileValidator("input"),
        ...decklinkValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await fileDecklink(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /file/srt:
 *    post:
 *      description: SRT encode a file.
 *      tags: [file]
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
 *         description: The name of the font file to use for text overlay. Must use the TrueType fonts. E.g - "swansea-bold.ttf"
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
        ...fileValidator("input"),
        ...srtValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await fileSrt(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /file/udp:
 *    post:
 *      description: UDP encode a file.
 *      tags: [file]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/udp",
    checkSchema({
        ...fileValidator("input"),
        ...udpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await fileUdp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /file/rtp:
 *    post:
 *      description: RTP encode a file.
 *      tags: [file]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/rtp",
    checkSchema({
        ...fileValidator("input"),
        ...rtpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await fileRtp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /file/rtmp:
 *    post:
 *      description: RTMP encode a file.
 *      tags: [file]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/rtmp",
    checkSchema({
        ...fileValidator("input"),
        ...rtmpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await fileRtmp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /file/hls:
 *    post:
 *      description: HLS encode a file.
 *      tags: [file]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/hls",
    checkSchema({
        ...fileValidator("input"),
        ...hlsValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await fileHls(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /file/metadata:
 *    get:
 *      description: Get the metadata in a media file.
 *      tags: [files]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: formData
 *          name: file
 *          type: string
 *          description: The filename including extension in the `./data/media` directory
 *          required: false
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/metadata", async (req, res, next) => {
    const response = await fileMetadata(req.body.filename);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /file/list:
 *    get:
 *      description: Gets a list of files in the "./data/media" folder.
 *      tags: [file]
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
 * /file:
 *    get:
 *      description: Download file by name.
 *      tags: [file]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/", async (req, res, next) => {
    const filePath = path.join(__dirname, "..", "data", "media", req.query.file);
    res.download(filePath);
});

/**
 * @swagger
 * /file:
 *    post:
 *      description: Upload a media file.
 *      tags: [file]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/", async (req, res, next) => {
    let response = { status: "success", errors: [] };
    fileUpload(req, res, (error) => {
        if (error) {
            response.errors[0] = error;
            response.status = "error";
        } else {
            response.file = req?.file;
        }
        hashResponse(res, req, response);
    });
});

module.exports = router;
