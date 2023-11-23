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

const decklinkFile = require("@services/decklink-file");
const decklinkSrt = require("@services/decklink-srt");
const decklinkUdp = require("@services/decklink-udp");
const decklinkRtp = require("@services/decklink-rtp");
const decklinkRtmp = require("@services/decklink-rtmp");
const decklinkHls = require("@services/decklink-hls");

const decklinkConfigGet = require("@services/decklink-config-get");
const decklinkConfigSet = require("@services/decklink-config-set");

const overlayValidator = require("@validators/overlay");
const thumbnailValidator = require("@validators/thumbnail");
const decklinkValidator = require("@validators/decklink");
const fileValidator = require("@validators/file");
const hlsValidator = require("@validators/hls");
const srtValidator = require("@validators/srt");
const rtmpValidator = require("@validators/rtmp");
const udpValidator = require("@validators/udp");
const rtpValidator = require("@validators/rtp");

/**
 * @swagger
 * /decklink/file:
 *    post:
 *      description: Takes Decklink input in SDI and encodes it as a file.
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/file",
    checkSchema({
        ...decklinkValidator("input"),
        ...fileValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await decklinkFile(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /decklink/srt:
 *    post:
 *      description: Takes Decklink input in SDI and encodes it as SRT.
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/srt",
    checkSchema({
        ...decklinkValidator("input"),
        ...srtValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await decklinkSrt(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /decklink/udp:
 *    post:
 *      description: Takes Decklink input in SDI and encodes it as UDP.
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/udp",
    checkSchema({
        ...decklinkValidator("input"),
        ...udpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await decklinkUdp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /decklink/rtp:
 *    post:
 *      description: Takes Decklink input in SDI and encodes it as RTP.
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/rtp",
    checkSchema({
        ...decklinkValidator("input"),
        ...rtpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await decklinkRtp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /decklink/rtmp:
 *    post:
 *      description: Takes Decklink input in SDI and encodes it as RTMP.
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/rtmp",
    checkSchema({
        ...decklinkValidator("input"),
        ...rtmpValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await decklinkRtmp(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /decklink/hls:
 *    post:
 *      description: Takes Decklink input in SDI and encodes it as HLS.
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/hls",
    checkSchema({
        ...decklinkValidator("input"),
        ...hlsValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await decklinkHls(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /decklink:
 *    get:
 *      description: Gets the info about currently attached Decklink cards
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/", async (req, res, next) => {
    const response = await decklinkConfigGet();
    hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
});

/**
 * @swagger
 * /decklink:
 *    post:
 *      description: Sets the config for an individual Decklink card
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/", async (req, res, next) => {
    const response = await decklinkConfigSet(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;
