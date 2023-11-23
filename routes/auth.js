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
const jwt = require("jsonwebtoken");
const md5 = require("md5");

const authValidator = require("@validators/auth");

/**
 * @swagger
 * /auth/login:
 *    post:
 *      description: Authorize user.
 *      tags: [auth]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: formData
 *          name: username
 *          type: string
 *          description: Username for API by default "admin"
 *          required: false
 *        - in: formData
 *          name: password
 *          type: string
 *          description: Password for API by default "ffmp3gap1"
 *          required: false
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/login", checkSchema(authValidator), async (req, res, next) => {
    let response = {};
    const errors = await validationResult(req);

    if (errors.isEmpty()) {
        const user = process.env.AUTH_USER || "admin";
        const passwordHash = md5(process.env.AUTH_PASSWORD || "ffmp3gap1");

        if (req.body.username === user && md5(req.body.password) === passwordHash) {
            const token = jwt.sign({ id: user }, process.env.AUTH_KEY || "averysecretkey");
            response.token = token;
        } else {
            response.errors = ["Username or password is incorrect"];
        }
    } else {
        response.errors = errors.array();
    }

    hashResponse(res, req, { ...response, ...{ status: response.errors ? "error" : "success" } });
});

module.exports = router;
