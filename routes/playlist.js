/*
FFmpeg Docker, an API wrapper around FFmpeg running in a configurable docker container
Copyright (C) 2022 Ryan McCartney

This file is part of the FFmpeg Docker (ffmpeg-docker).

FFmpeg Docker is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

"use strict";

const router = require("express").Router();
const { checkSchema, validationResult } = require("express-validator");
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
    const response = await ffconcat.set(req.params.playlist, req.body.items);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /playlist/:playlist/add:
 *    post:
 *      description: Add a single file to the playlist.
 *      tags: [files]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/:playlist/add", async (req, res, next) => {
    const response = await ffconcat.add(req.params.playlist, req.body.item);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /playlist/:playlist/remove:
 *    post:
 *      description: Add a single file to the playlist.
 *      tags: [files]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/:playlist/remove", async (req, res, next) => {
    const response = await ffconcat.remove(req.params.playlist, req.body.item);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

module.exports = router;
