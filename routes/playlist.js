"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const ffconcat = require("@utils/ffconcat");

/**
 * @swagger
 * /playlist/:playlist:
 *    get:
 *      description: Get all the items in a playlist
 *      tags: [files]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/:playlist", async (req, res, next) => {
    const response = await ffconcat.getItems(req.params.playlist);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /playlist/:playlist:
 *    post:
 *      description: Set all the items in a playlist
 *      tags: [files]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/:playlist", async (req, res, next) => {
    const response = await ffconcat.set(req.params.playlist,req.body.items);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /playlist/:playlist/add:
 *    get:
 *      description: Add a single file to the playlist.
 *      tags: [files]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/:playlist/add", async (req, res, next) => {
    const response = await ffconcat.add(req.params.playlist,req.body.item);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /playlist/:playlist/add:
 *    get:
 *      description: Add a single file to the playlist.
 *      tags: [files]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/:playlist/remove", async (req, res, next) => {
    const response = await ffconcat.remove(req.params.playlist,req.body.item);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

module.exports = router;
