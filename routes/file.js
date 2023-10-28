"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const path = require("path");

const fileDecklink = require("@services/file-decklink");
const fileUdp = require("@services/file-udp");
const fileSrt = require("@services/file-srt");
const fileRtmp = require("@services/file-rtmp");
const fileHls = require("@services/file-hls");

const fileMetadata = require("@services/file-metadata");

/**
 * @swagger
 * /file/decklink:
 *    get:
 *      description: Takes a file as an input and outputs it to a decklink card.
 *      tags: [file]
 *      parameters:
 *        - in: formData
 *          name: filename
 *          type: string
 *          description: Filename and extension of media to playout. E.g - test.mp4
 *          required: true
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
router.get("/decklink", async (req, res, next) => {
    const response = await fileDecklink(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /file/srt:
 *    get:
 *      description: SRT encode a file.
 *      tags: [file]
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
router.get("/srt", async (req, res, next) => {
    const response = await fileSrt(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /file/udp:
 *    get:
 *      description: UDP encode a file.
 *      tags: [file]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/udp", async (req, res, next) => {
    const response = await fileUdp(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /file/rtmp:
 *    get:
 *      description: RTMP encode a file.
 *      tags: [file]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/rtmp", async (req, res, next) => {
    const response = await fileRtmp(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /file/hls:
 *    get:
 *      description: HLS encode a file.
 *      tags: [file]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/hls", async (req, res, next) => {
    const response = await fileHls(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /file/metadata:
 *    get:
 *      description: Get the metadata in a media file.
 *      tags: [files]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/metadata", async (req, res, next) => {
    const response = await fileMetadata(req.body.filename);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /file:
 *    get:
 *      description: Download file by name.
 *      tags: [file]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/", async (req, res, next) => {
    const filePath = path.join(__dirname, "..", "data", "media", req.query.filename);
    res.download(filePath);
});

module.exports = router;
