"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const encodeFileUdp = require("@services/encode-file-udp");
const encodeFileSrt = require("@services/encode-file-srt");
const encodeFileRtmp = require("@services/encode-file-rtmp");
const encodeFileHls = require("@services/encode-file-hls");
const encodeBarsRtmp = require("@services/encode-bars-rtmp");
const encodeBarsUdp = require("@services/encode-bars-udp");
const encodeBarsSrt = require("@services/encode-bars-srt");
const encodeBarsHls = require("@services/encode-bars-hls");
const encodeDecklinkFile = require("@services/encode-decklink-file");
const encodeDecklinkSrt = require("@services/encode-decklink-srt");
const encodeDecklinkUdp = require("@services/encode-decklink-udp");
const encodeDecklinkRtmp = require("@services/encode-decklink-rtmp");
const encodeDecklinkHls = require("@services/encode-decklink-hls");

/**
 * @swagger
 * /encode/file/srt:
 *    get:
 *      description: SRT encode a file.
 *      tags: [encode]
 *      parameters:
 *       - in: formData
 *         name: filename
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
router.get("/file/srt", async (req, res, next) => {
    const response = await encodeFileSrt(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/file/udp:
 *    get:
 *      description: UDP encode a file.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/file/udp", async (req, res, next) => {
    const response = await encodeFileUdp(req.body);
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
    const response = await encodeFileRtmp(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/file/hls:
 *    get:
 *      description: HLS encode a file.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/file/hls", async (req, res, next) => {
    const response = await encodeFileHls(req.body);
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
router.get("/bars/rtmp", async (req, res, next) => {
    const response = await encodeBarsRtmp(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/bars/udp:
 *    get:
 *      description: UDP encode test bars.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/bars/udp", async (req, res, next) => {
    const response = await encodeBarsUdp(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/bars/hls:
 *    get:
 *      description: HLS encode test bars.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/bars/hls", async (req, res, next) => {
    const response = await encodeBarsHls(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /encode/decklink/file:
 *    get:
 *      description: Takes Decklink input in SDI and encodes it as a file.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/decklink/file", async (req, res, next) => {
    const response = await encodeDecklinkFile(req.body);
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
 * /encode/decklink/udp:
 *    get:
 *      description: Takes Decklink input in SDI and encodes it as UDP.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/decklink/udp", async (req, res, next) => {
    const response = await encodeDecklinkUdp(req.body);
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

/**
 * @swagger
 * /encode/decklink/hls:
 *    get:
 *      description: Takes Decklink input in SDI and encodes it as HLS.
 *      tags: [encode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/decklink/hls", async (req, res, next) => {
    const response = await encodeDecklinkHls(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;
