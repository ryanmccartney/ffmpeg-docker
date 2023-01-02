"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const outputSrt = require("@services/output-srt");

/**
 * @swagger
 * /stream/srt:
 *    get:
 *      description: SRT Stream test bars.
 *      tags: [stream]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/srt", async (req, res, next) => {
    const response = await outputSrt(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;
