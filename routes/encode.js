"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const encodeFileSrt = require("@services/encode-file-srt");
const encodeBarsSrt = require("@services/encode-bars-srt");
const encodeRtmpFile = require("@services/encode-file-rtmp");
const encodeRtmpBars = require("@services/encode-bars-rtmp");
const encodeDecklinkSrt = require("@services/encode-decklink-srt");
const encodeDecklinkRtmp = require("@services/encode-decklink-rtmp");

/**
 * @swagger
 * /encode/file/srt:
 *    get:
 *      description: SRT encode a file.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/file/srt", async (req, res, next) => {
    const response = await encodeFileSrt(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/file/rtmp:
 *    get:
 *      description: RTMP encode a file.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/file/rtmp", async (req, res, next) => {
    const response = await encodeRtmpFile(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/bars/srt:
 *    get:
 *      description: SRT encode test bars.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/bars/srt", async (req, res, next) => {
    const response = await encodeBarsSrt(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/bars/rtmp:
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
    const response = await encodeRtmpBars(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/decklink/srt:
 *    get:
 *      description: Takes Decklink input in SDI and encodes it as SRT.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/decklink/srt", async (req, res, next) => {
    const response = await encodeDecklinkSrt(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/decklink/rtmp:
 *    get:
 *      description: Takes Decklink input in SDI and encodes it as RTMP.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/decklink/rtmp", async (req, res, next) => {
    const response = await encodeDecklinkRtmp(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});
module.exports = router;
