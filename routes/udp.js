"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const udpDecklink = require("@services/udp-decklink");

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

module.exports = router;
