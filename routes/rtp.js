"use strict";

const router = require("express").Router();
const { checkSchema, validationResult } = require("express-validator");
const hashResponse = require("@utils/hash-response");

const rtpFile = require("@services/rtp-file");
const rtpDecklink = require("@services/rtp-decklink");

const overlayValidator = require("@validators/overlay");
const thumbnailValidator = require("@validators/thumbnail");
const decklinkValidator = require("@validators/decklink");
const fileValidator = require("@validators/srt");
const rtpValidator = require("@validators/rtp");

/**
 * @swagger
 * /rtp/file:
 *    post:
 *      description: Takes an RTP input and turns it into a file.
 *      tags: [rtp]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/file",
    checkSchema({
        ...rtpValidator,
        ...fileValidator,
        ...thumbnailValidator,
        ...overlayValidator,
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await rtpFile(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /rtp/decklink:
 *    post:
 *      description: Takes an RTP input and outputs it to a decklink card.
 *      tags: [rtp]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/decklink",
    checkSchema({
        ...rtpValidator,
        ...decklinkValidator,
        ...thumbnailValidator,
        ...overlayValidator,
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await rtpDecklink(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

module.exports = router;
