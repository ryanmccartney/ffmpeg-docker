"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const decodeSrtFile = require("@services/decode-srt-file");

/**
 * @swagger
 * /decode/srt/file:
 *    get:
 *      description: Takes an SRT input and turns it into a file.
 *      tags: [decode]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/srt/file", async (req, res, next) => {
    const response = await decodeSrtFile(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});


module.exports = router;
