"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const udpDecklink = require("@services/udp-decklink");
const udpFile = require("@services/udp-file");

/**
 * @swagger
 * /udp/decklink:
 *    get:
 *      description: Takes an UDP input and outputs it to a decklink card.
 *      tags: [udp]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/decklink", async (req, res, next) => {
    const response = await udpDecklink(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /udp/file:
 *    get:
 *      description: Takes an UDP input and outputs it to a file.
 *      tags: [udp]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/file", async (req, res, next) => {
    const response = await udpFile(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;
