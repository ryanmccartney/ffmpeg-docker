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
const path = require("path");

/**
 * @swagger
 * /:
 *    get:
 *      description: Index page if web GUI option is enabled
 *      tags: [page]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/", async (req, res, next) => {
    res.render("index", { title: "Home" });
});

/**
 * @swagger
 * /clock:
 *    get:
 *      description: An HTML page with a live clock showing server time - suitable for latency measurements
 *      tags: [page]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/clock", async (req, res, next) => {
    res.render("clock", { title: "Clock" });
});

/**
 * @swagger
 * /jobs:
 *    get:
 *      description: An HTML page showing a simple job manager
 *      tags: [page]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/jobs", async (req, res, next) => {
    res.render("jobs", { title: "Jobs" });
});

/**
 * @swagger
 * /chart:
 *    get:
 *      description: An HTML page showing VMAF test results as a chart
 *      tags: [page]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/chart", async (req, res, next) => {
    res.render("chart", { title: "Chart" });
});

/**
 * @swagger
 * /video:
 *    get:
 *      description: An HTML page with a video player for hls streams
 *      tags: [page]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/video", async (req, res, next) => {
    res.render("video", { title: "Video" });
});

module.exports = router;
