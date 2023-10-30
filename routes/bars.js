"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const barsDecklink = require("@services/bars-decklink");
const barsFile = require("@services/bars-file");
const barsRtmp = require("@services/bars-rtmp");
const barsUdp = require("@services/bars-udp");
const barsRtp = require("@services/bars-rtp");
const barsSrt = require("@services/bars-srt");
const barsHls = require("@services/bars-hls");

/**
 * @swagger
 * /bars/decklink:
 *    post:
 *      description: Takes a set of test Bars as an input and outputs it to a decklink card.
 *      tags: [bars]
 *      parameters:
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
router.post("/decklink", async (req, res, next) => {
    const response = await barsDecklink(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

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
router.post("/file", async (req, res, next) => {
    const response = await barsFile(req.body);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

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
router.post("/srt", async (req, res, next) => {
    const response = await barsSrt(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

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
router.post("/rtmp", async (req, res, next) => {
    const response = await barsRtmp(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

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
router.post("/udp", async (req, res, next) => {
    const response = await barsUdp(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

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
router.post("/rtp", async (req, res, next) => {
    const response = await barsRtp(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

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
router.post("/hls", async (req, res, next) => {
    const response = await barsHls(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;
