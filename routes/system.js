"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const setTime = require("@services/system-time-set");
const jobKill = require("@services/system-job-kill");
const jobGet = require("@services/system-job-get");
const jobGetAll = require("@services/system-job-getall");
const path = require("path");

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
 * /system/job/kill/:jobId:
 *    get:
 *      description: Kills a job by ID
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/job/kill/:jobId", async (req, res, next) => {
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

/**
 * @swagger
 * /system/clock:
 *    get:
 *      description: An HTML page with a live clock showing server time - suitable for latency measurements
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/clock", async (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "public", "html", "clock.html"));
});

module.exports = router;
