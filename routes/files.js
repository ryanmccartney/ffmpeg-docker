"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const getMetadata = require("@services/metadata-get");

/**
 * @swagger
 * /files/metadata:
 *    get:
 *      description: Get the metadata in a media file.
 *      tags: [files]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/metadata", async (req, res, next) => {
    const response = await getMetadata(req.body?.filename);
    hashResponse(res, req, { ...response, ...{ status: response?.error ? "error" : "success" } });
});

module.exports = router;
