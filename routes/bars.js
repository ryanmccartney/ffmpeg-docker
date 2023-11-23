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

const barsDecklink = require("@services/bars-decklink");
const barsFile = require("@services/bars-file");
const barsRtmp = require("@services/bars-rtmp");
const barsUdp = require("@services/bars-udp");
const barsRtp = require("@services/bars-rtp");
const barsSrt = require("@services/bars-srt");
const barsHls = require("@services/bars-hls");

const overlayValidator = require("@validators/overlay");
const thumbnailValidator = require("@validators/thumbnail");
const barsValidator = require("@validators/bars");
const decklinkValidator = require("@validators/decklink");
const fileValidator = require("@validators/file");
const hlsValidator = require("@validators/hls");
const srtValidator = require("@validators/srt");
const rtmpValidator = require("@validators/rtmp");
const udpValidator = require("@validators/udp");
const rtpValidator = require("@validators/rtp");

/**
 * @swagger
 * /bars/decklink:
 *    post:
 *      description: Takes a set of test Bars as an input and outputs it to a decklink card.
 *      tags: [bars]
 *      parameters:
 *        - in: body
 *          type: "object"
 *          properties:
 *              input:
 *                  type: "object"
 *                  properties:
 *                      type:
 *                          type: "string"
 *                          description: "The type of color bars outputed"
 *                          example: "testsrc2"
 *                          required: false
 *                      freqeuncy:
 *                          type: "number"
 *                          description: "The audio frequency of color bars outputed in hertz"
 *                          example: 1000
 *                          required: false
 *              output:
 *                  type: "object"
 *                  properties:
 *                      cardName:
 *                          type: "string"
 *                          description: The name of the BMD Decklink cards"
 *                          example: "DeckLink SDI"
 *                          required: true
 *                      duplexMode:
 *                          type: "string"
 *                          description: Duplex mode of the BMD Decklink card"
 *                          example: "full"
 *                          required: false
 *                      volume:
 *                          type: "number"
 *                          description: Volume output of the BMD Decklink card between 0 and 1"
 *                          example: 0.25
 *                          required: false
 *              overlay:
 *                  type: "object"
 *                  properties:
 *                      font:
 *                          type: "string"
 *                          description: "The name of the font file to use for text overlay. Must use the TrueType fonts"
 *                          example: "swansea-bold.ttf"
 *                          required: false
 *                      timecode:
 *                          type: "boolean"
 *                          description: "Show the timecode line"
 *                          example: false
 *                          required: false
 *                      offset:
 *                          type: "number"
 *                          description: "Offset for time in hours. E.g 3, -3"
 *                          example: 0
 *                          required: false
 *              thumbnail:
 *                  type: "object"
 *                  properties:
 *                      frequency:
 *                          type: "number"
 *                          description: "Frequency a thumbnail is prodicd in frames."
 *                          example: 25
 *                          required: false
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/decklink",
    checkSchema({
        ...barsValidator("input"),
        ...decklinkValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await barsDecklink(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /file:
 *    post:
 *      description: Generate custom ident bars.
 *      tags: [bars]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/file",
    checkSchema({
        ...barsValidator("input"),
        ...fileValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await barsFile(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /bars/srt:
 *    post:
 *      description: SRT encode test bars.
 *      tags: [bars]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/srt",
    checkSchema({
        ...barsValidator("input"),
        ...srtValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await barsSrt(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /bars/rtmp:
 *    post:
 *      description: RTMP encode test bars.
 *      tags: [bars]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/rtmp",
    checkSchema({
        ...barsValidator("input"),
        ...rtmpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await barsRtmp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /bars/udp:
 *    post:
 *      description: UDP encode test bars.
 *      tags: [bars]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/udp",
    checkSchema({
        ...barsValidator("input"),
        ...udpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await barsUdp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);
/**
 * @swagger
 * /bars/rtp:
 *    post:
 *      description: RTP encode test bars.
 *      tags: [bars]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/rtp",
    checkSchema({
        ...barsValidator("input"),
        ...rtpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await barsRtp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /bars/hls:
 *    post:
 *      description: HLS encode test bars.
 *      tags: [bars]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/hls",
    checkSchema({
        ...barsValidator("input"),
        ...hlsValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await barsHls(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

module.exports = router;
