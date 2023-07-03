"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const outputDecklinkFile = require("@services/output-decklink-file");
const outputDecklinkBars = require("@services/output-decklink-bars");
const outputDecklinkStop = require("@services/output-decklink-stop");
const getDecklinkConfig = require("@services/decklink-config-get");
const setDecklinkConfig = require("@services/decklink-config-set");
const getDecklinkInfo = require("@services/decklink-info-get");

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