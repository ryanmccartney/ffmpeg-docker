"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const outputSrtFile = require("@services/output-srt-file");
const outputSrtBars = require("@services/output-srt-bars");
const outputRtmpFile = require("@services/output-rtmp-file");
const outputRtmpBars = require("@services/output-rtmp-bars");

/**
 * @swagger
 * /stream/srt/file:
 *    get:
 *      description: SRT Stream a file.
 *      tags: [stream]
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
 * /stream/rtmp/file:
 *    get:
 *      description: RTMP Stream a file.
 *      tags: [stream]
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
 * /stream/srt/bars:
 *    get:
 *      description: SRT Stream test bars.
 *      tags: [stream]
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
 * /stream/rtmp/bars:
 *    get:
 *      description: RTMP Stream test bars.
 *      tags: [stream]
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
