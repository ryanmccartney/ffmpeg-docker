"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const getMetadata = require("@services/metadata-get");
const barsFileOutput = require("@services/output-file-bars");
const path = require("path");

/**
 * @swagger
 * /file/metadata:
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
    const response = await getMetadata(req.body.filename);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /file/bars:
 *    get:
 *      description: Generate custom ident bars.
 *      tags: [files]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/bars", async (req, res, next) => {
    const response = await barsFileOutput(req.body);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /file/download:
 *    get:
 *      description: Download file by name.
 *      tags: [files]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/download", async (req, res, next) => {
    const filePath = path.join(__dirname, "..", "data", "media", req.query.filename);
    res.download(filePath);
});

module.exports = router;
