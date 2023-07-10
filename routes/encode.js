"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const outputSrtFile = require("@services/output-srt-file");
const outputSrtBars = require("@services/output-srt-bars");
const outputRtmpFile = require("@services/output-rtmp-file");
const outputRtmpBars = require("@services/output-rtmp-bars");

/**
 * @swagger
 * /encode/srt/file:
 *    get:
 *      description: SRT encode a file.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/srt/file", async (req, res, next) => {
    const response = await outputSrtFile(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/rtmp/file:
 *    get:
 *      description: RTMP encode a file.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/rtmp/file", async (req, res, next) => {
    const response = await outputRtmpFile(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/srt/bars:
 *    get:
 *      description: SRT encode test bars.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/srt/bars", async (req, res, next) => {
    const response = await outputSrtBars(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/rtmp/bars:
 *    get:
 *      description: RTMP encode test bars.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/rtmp/bars", async (req, res, next) => {
    const response = await outputRtmpBars(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;
