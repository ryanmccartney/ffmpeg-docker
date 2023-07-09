"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const outputDecklinkFile = require("@services/output-decklink-file");
const outputDecklinkBars = require("@services/output-decklink-bars");
const outputDecklinkStop = require("@services/output-decklink-stop");
const outputDecklinkPause = require("@services/output-decklink-pause");
const getDecklinkConfig = require("@services/decklink-config-get");
const setDecklinkConfig = require("@services/decklink-config-set");
const getDecklinkInfo = require("@services/decklink-info-get");
const thumbnailGet = require("@services/thumbnail-get");
const inputDecklinkFile = require("@services/input-decklink-file");
const inputDecklinkHls = require("@services/input-decklink-hls");
const inputDecklinkSrt = require("@services/input-decklink-srt");
const inputDecklinkThumbnail = require("@services/input-decklink-thumbnail");

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
    const response = await getDecklinkInfo();
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decklink/:cardIndex:
 *    get:
 *      description: Gets the config for an individual Decklink card
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/:cardIndex", async (req, res, next) => {
    const response = await getDecklinkConfig(req.params.cardIndex);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decklink/:cardIndex:
 *    post:
 *      description: Sets the config for an individual Decklink card
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/:cardIndex", async (req, res, next) => {
    const response = await setDecklinkConfig(req.params.cardIndex,req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decklink/:cardIndex/file:
 *    get:
 *      description: Sends a file to a decklink output
 *      tags: [decklink]
 *      parameters:
 *       - in: formData
 *         name: filename
 *         type: string
 *         description: Filename and extension of media to playout. E.g - test.mp4
 *         required: true
 *       - in: formData
 *         name: cardName
 *         type: string
 *         description: The name of the BMD Decklink cards. E.g - "DeckLink SDI"
 *         required: true
 *       - in: formData
 *         name: font
 *         type: string
 *         description: The name of the font file to use for text overlay. Must use the TrueType fonts. E.g - "swansea-bold.ttf"
 *         required: font
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
router.get("/:cardIndex/file", async (req, res, next) => {
    const response = await outputDecklinkFile(req.params.cardIndex,req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decklink/:cardIndex/record:
 *    get:
 *      description: Record the input of a decklink card index to file
 *      tags: [decklink]
 *      parameters:
 *       - in: formData
 *         name: cardName
 *         type: string
 *         description: The name of the BMD Decklink cards. E.g - "DeckLink SDI"
 *         required: true
 *       - in: formData
 *         name: font
 *         type: string
 *         description: The name of the font file to use for text overlay. Must use the TrueType fonts. E.g - "swansea-bold.ttf"
 *         required: font
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
router.get("/:cardIndex/record", async (req, res, next) => {
    const response = await inputDecklinkFile(req.params.cardIndex,req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decklink/:cardIndex/hls:
 *    get:
 *      description: Converts the input of a decklink card index to hls
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/:cardIndex/hls", async (req, res, next) => {
    const response = await inputDecklinkHls(req.params.cardIndex,req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decklink/:cardIndex:/srt:
 *    get:
 *      description: Converts the input of a decklink card index to hls
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/:cardIndex/srt", async (req, res, next) => {
    const response = await inputDecklinkSrt(req.params.cardIndex,req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decklink/:cardIndex/bars:
 *    get:
 *      description: Sends some SMPTE bars to a decklink output
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/:cardIndex/bars", async (req, res, next) => {
    const response = await outputDecklinkBars(req.params.cardIndex,req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decklink/:cardIndex/thumbnail:
 *    get:
 *      description: Get thumbnail of the decklink output
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/:cardIndex/thumbnail", async (req, res, next) => {
    const response = await thumbnailGet(`./data/decklink-thumbnail-${req.params.cardIndex}.png`,req.body.resize);

    const base64Data = response.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const img = Buffer.from(base64Data, 'base64');

    if(req.body.raw){
        hashResponse(res, req, { data: response, status: response ? "success" : "error" });
    }
    else{
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img);
    }
});

/**
 * @swagger
 * /decklink/:cardIndex/stop:
 *    get:
 *      description: Stops the decklink output on a particular index
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/:cardIndex/stop", async (req, res, next) => {
    const response = await outputDecklinkStop(req.params.cardIndex,req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decklink/:cardIndex/pause:
 *    get:
 *      description: Pauses the decklink output on a particular index
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/:cardIndex/pause", async (req, res, next) => {
    const response = await outputDecklinkPause(req.params.cardIndex,req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;