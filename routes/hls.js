"use strict";

const router = require("express").Router();
const express = require("express");
const path = require("path");

/**
 * @swagger
 * /hls:
 *    get:
 *      description: Servers the HLS manifest files.
 *      tags: [hls]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.use("/", express.static(path.join(__dirname, "..", "data", "hls")));

module.exports = router;
