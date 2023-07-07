"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const outputDecklinkFile = require("@services/output-decklink-file");
const outputDecklinkBars = require("@services/output-decklink-bars");
const outputDecklinkStop = require("@services/output-decklink-stop");
const getDecklinkConfig = require("@services/decklink-config-get");
const setDecklinkConfig = require("@services/decklink-config-set");
const getDecklinkInfo = require("@services/decklink-info-get");
const thumbnailGet = require("@services/thumbnail-get");
const inputDecklink = require("@services/input-decklink");

/**
 * @swagger
 * /decklink/info:
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
 * /decklink/cardIndex:
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
 * /decklink/cardIndex:
 *    get:
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
 * /decklink/:cardIndex:/file:
 *    get:
 *      description: Sends a file to a decklink output
 *      tags: [decklink]
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
 * /decklink/:cardIndex:/recod:
 *    get:
 *      description: Record the input of a decklink card index to file
 *      tags: [decklink]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/:cardIndex/record", async (req, res, next) => {
    const response = await inputDecklink(req.params.cardIndex,req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /decklink/bars:
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
 * /decklink/stop:
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


module.exports = router;