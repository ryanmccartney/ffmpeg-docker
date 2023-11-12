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
