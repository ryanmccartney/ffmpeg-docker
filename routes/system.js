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
const path = require("path");
const hashResponse = require("@utils/hash-response");

const setTime = require("@services/system-time-set");
const systemStats = require("@services/system-stats");
const systemInfo = require("@services/system-info");

const jobKill = require("@services/system-job-kill");
const jobGet = require("@services/system-job-get");
const jobGetAll = require("@services/system-job-getall");
const jobKillAll = require("@services/system-job-killall");
const jobThumbnailGet = require("@services/system-job-getthumbnail");

/**
 * @swagger
 * /system/hello:
 *    get:
 *      description: Test route, API greets you in response.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/hello", (req, res, next) => {
    const message = { data: "Good morning sunshine, the earth says hello." };
    hashResponse(res, req, message);
});

/**
 * @swagger
 * /system/time:
 *    post:
 *      description: Set NTP server and sync.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/time", async (req, res, next) => {
    const response = await setTime(req.body.server);
    hashResponse(res, req, response);
});

/**
 * @swagger
 * /system/time:
 *    get:
 *      description: Get server time.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/time", async (req, res, next) => {
    const dateTimeObject = new Date();
    const response = {
        data: {
            datatime: dateTimeObject,
            date: dateTimeObject.toDateString(),
            time: dateTimeObject.toTimeString(),
        },
    };
    hashResponse(res, req, response);
});

/**
 * @swagger
 * /system/info:
 *    get:
 *      description: Get system information, versions, options, etc
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/info", async (req, res, next) => {
    const response = await systemInfo();
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /system/stats:
 *    get:
 *      description: Get system stats; CPU, memory, etc.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/stats", async (req, res, next) => {
    const response = await systemStats();
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /system/job/kill/all:
 *    post:
 *      description: Kill all running jobs
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/job/kill/all", async (req, res, next) => {
    const response = await jobKillAll();
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /system/job/kill/:jobId:
 *    post:
 *      description: Kills a job by ID
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/job/kill/:jobId", async (req, res, next) => {
    const response = await jobKill(req.params.jobId);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /system/job/all:
 *    get:
 *      description: Gets all jobs that are running
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/job/all", async (req, res, next) => {
    const response = await jobGetAll();
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

/**
 * @swagger
 * /system/job/thumbnail/:jobId:
 *    get:
 *      description: Gets a thumnail for a job by it's Job ID
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/job/thumbnail/:jobId", async (req, res, next) => {
    const response = await jobThumbnailGet(req.params.jobId, req.body.resize);

    const base64Data = response.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    const img = Buffer.from(base64Data, "base64");

    if (req.body.raw) {
        hashResponse(res, req, { data: response, status: response ? "success" : "error" });
    } else {
        res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": img.length,
        });
        res.end(img);
    }
});

/**
 * @swagger
 * /system/job/:jobId:
 *    get:
 *      description: Gets a job by ID
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/job/:jobId", async (req, res, next) => {
    const response = await jobGet(req.params.jobId);
    hashResponse(res, req, { ...response, ...{ status: response.error ? "error" : "success" } });
});

module.exports = router;
