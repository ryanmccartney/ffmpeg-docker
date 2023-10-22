"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const outputDecklinkAudio = require("@services/output-decklink-audio");
const outputDecklinkStop = require("@services/output-decklink-stop");
const outputDecklinkPause = require("@services/output-decklink-pause");
const getDecklinkConfig = require("@services/decklink-config-get");
const setDecklinkConfig = require("@services/decklink-config-set");
const getDecklinkInfo = require("@services/decklink-info-get");

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
router.post("/", async (req, res, next) => {
    const response = await setDecklinkConfig(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decklink/:cardIndex/audio:
 *    get:
 *      description: Sends an audio file to a decklink output
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
router.get("/:cardIndex/audio", async (req, res, next) => {
    const response = await outputDecklinkAudio(req.params.cardIndex, req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
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
    const response = await outputDecklinkStop(req.params.cardIndex, req.body);
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
    const response = await outputDecklinkPause(req.params.cardIndex, req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;
