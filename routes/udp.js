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

const udpDecklink = require("@services/udp-decklink");
const udpFile = require("@services/udp-file");

const overlayValidator = require("@validators/overlay");
const thumbnailValidator = require("@validators/thumbnail");
const decklinkValidator = require("@validators/decklink");
const fileValidator = require("@validators/file");
const udpValidator = require("@validators/udp");

/**
 * @swagger
 * /udp/decklink:
 *    post:
 *      description: Takes an UDP input and outputs it to a decklink card.
 *      tags: [udp]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/decklink",
    checkSchema({
        ...udpValidator("input"),
        ...decklinkValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await udpDecklink(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

/**
 * @swagger
 * /udp/file:
 *    post:
 *      description: Takes an UDP input and outputs it to a file.
 *      tags: [udp]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post(
    "/file",
    checkSchema({
        ...udpValidator("input"),
        ...fileValidator("output"),
        ...thumbnailValidator(),
        ...overlayValidator(),
    }),
    async (req, res, next) => {
        let response = {};
        const errors = await validationResult(req);

        if (errors.isEmpty()) {
            response = await udpFile(req.body);
        } else {
            response.errors = errors.array();
        }

        hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
    }
);

module.exports = router;
