"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const outputDecklinkFile = require("@services/output-decklink-file");
const outputDecklinkBars = require("@services/output-decklink-bars");
const outputDecklinkStop = require("@services/output-decklink-stop");

/**
 * @swagger
 * /decklink/file:
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
    const response = await outputDecklinkFile(req.cardIndex,req.body);
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
    const response = await outputDecklinkBars(req.cardIndex,req.body);
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
    const response = await outputDecklinkStop(req.cardIndex,req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});


module.exports = router;