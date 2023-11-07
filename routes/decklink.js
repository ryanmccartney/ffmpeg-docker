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
const fileValidator = require("@validators/srt");
const hlsValidator = require("@validators/srt");
const srtValidator = require("@validators/srt");
const rtmpValidator = require("@validators/rtmp");
const udpValidator = require("@validators/udp");
const rtpValidator = require("@validators/udp");

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
        ...decklinkValidator,
        ...fileValidator,
        ...thumbnailValidator,
        ...overlayValidator,
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
        ...decklinkValidator,
        ...srtValidator,
        ...thumbnailValidator,
        ...overlayValidator,
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
        ...decklinkValidator,
        ...udpValidator,
        ...thumbnailValidator,
        ...overlayValidator,
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
        ...decklinkValidator,
        ...rtpValidator,
        ...thumbnailValidator,
        ...overlayValidator,
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
        ...decklinkValidator,
        ...rtmpValidator,
        ...thumbnailValidator,
        ...overlayValidator,
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
        ...decklinkValidator,
        ...hlsValidator,
        ...thumbnailValidator,
        ...overlayValidator,
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
