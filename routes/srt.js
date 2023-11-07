"use strict";

const router = require("express").Router();
const { checkSchema, validationResult } = require("express-validator");
const hashResponse = require("@utils/hash-response");

const srtFile = require("@services/srt-file");
const srtDecklink = require("@services/srt-decklink");

const overlayValidator = require("@validators/overlay");
const thumbnailValidator = require("@validators/thumbnail");
const decklinkValidator = require("@validators/decklink");
const fileValidator = require("@validators/file");
const srtValidator = require("@validators/srt");

/**
 * @swagger
 * /srt/file:
 *    post:
 *      description: Takes an SRT input and turns it into a file.
 *      tags: [srt]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/file",
    checkSchema({
        ...srtValidator("input"),
        ...fileValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await srtFile(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /srt/decklink:
 *    post:
 *      description: Takes an SRT input and outputs it to a decklink card.
 *      tags: [srt]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/decklink",
    checkSchema({
        ...srtValidator("input"),
        ...decklinkValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await srtDecklink(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

module.exports = router;
