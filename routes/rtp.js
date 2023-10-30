"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const rtpFile = require("@services/rtp-file");
const rtpDecklink = require("@services/rtp-decklink");

/**
 * @swagger
 * /rtp/file:
 *    post:
 *      description: Takes an RTP input and turns it into a file.
 *      tags: [rtp]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/file", async (req, res, next) => {
    const response = await rtpFile(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /rtp/decklink:
 *    post:
 *      description: Takes an RTP input and outputs it to a decklink card.
 *      tags: [rtp]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/decklink", async (req, res, next) => {
    const response = await rtpDecklink(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;
