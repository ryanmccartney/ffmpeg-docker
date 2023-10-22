"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const decodeSrtFile = require("@services/decode-srt-file");
const decodeSrtDecklink = require("@services/decode-srt-decklink");
const decodeUdpDecklink = require("@services/decode-udp-decklink");
const decodeFileDecklink = require("@services/decode-file-decklink");
const decodeBarsDecklink = require("@services/decode-bars-decklink");

/**
 * @swagger
 * /decode/srt/file:
 *    get:
 *      description: Takes an SRT input and turns it into a file.
 *      tags: [decode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/srt/file", async (req, res, next) => {
    const response = await decodeSrtFile(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decode/srt/decklink:
 *    get:
 *      description: Takes an SRT input and outputs it to a decklink card.
 *      tags: [decode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/srt/decklink", async (req, res, next) => {
    const response = await decodeSrtDecklink(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decode/udp/decklink:
 *    get:
 *      description: Takes an UDP input and outputs it to a decklink card.
 *      tags: [decode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/udp/decklink", async (req, res, next) => {
    const response = await decodeUdpDecklink(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decode/bars/decklink:
 *    get:
 *      description: Takes a set of test Bars as an input and outputs it to a decklink card.
 *      tags: [decode]
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
router.get("/file/decklink", async (req, res, next) => {
    const response = await decodeFileDecklink(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decode/bars/decklink:
 *    get:
 *      description: Takes a set of test Bars as an input and outputs it to a decklink card.
 *      tags: [decode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/bars/decklink", async (req, res, next) => {
    const response = await decodeBarsDecklink(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;
