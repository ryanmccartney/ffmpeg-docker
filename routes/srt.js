"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const srtFile = require("@services/srt-file");
const srtDecklink = require("@services/srt-decklink");

/**
 * @swagger
 * /srt/file:
 *    get:
 *      description: Takes an SRT input and turns it into a file.
 *      tags: [srt]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/file", async (req, res, next) => {
    const response = await srtFile(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /srt/decklink:
 *    get:
 *      description: Takes an SRT input and outputs it to a decklink card.
 *      tags: [srt]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/decklink", async (req, res, next) => {
    const response = await srtDecklink(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;
