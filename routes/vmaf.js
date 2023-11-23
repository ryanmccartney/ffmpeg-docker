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
const path = require("path");

const getVmafModels = require("@services/vmaf-models-get");
const getVmafResultsCsv = require("@services/vmaf-results-csv");
const getVmafResultsJson = require("@services/vmaf-results-json");
const testVmaf = require("@services/vmaf-file-test");

const fileExists = require("@utils/file-exists");

/**
 * @swagger
 * /vmaf/models:
 *    get:
 *      description: Returns a list of VMAF models.
 *      tags: [vmaf]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/models", async (req, res, next) => {
    const response = await getVmafModels(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /vmaf/test:
 *    post:
 *      description: Run a VMAF test specifing a reference file and test file.
 *      tags: [vmaf]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.post("/test", async (req, res, next) => {
    const response = await testVmaf(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

/**
 * @swagger
 * /vmaf/results/json:
 *    get:
 *      description: Get a VMAF results file as a JSON object.
 *      tags: [vmaf]
 *      produces:
 *        - application/file
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/results/json", async (req, res) => {
    const response = await getVmafResultsJson(req.query.filename);
    hashResponse(res, req, { data: response, status: response ? true : false });
});

/**
 * @swagger
 * /vmaf/results/csv:
 *    get:
 *      description: Get a VMAF results file as a CSV object.
 *      tags: [vmaf]
 *      produces:
 *        - application/file
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/results/csv", async (req, res) => {
    const response = await getVmafResultsCsv(req.query.filename);
    hashResponse(res, req, { data: response, status: response ? true : false });
});

/**
 * @swagger
 * /vmaf/results/download/csv:
 *    get:
 *      description: Get a VMAF results file as a CSV file.
 *      tags: [vmaf]
 *      produces:
 *        - application/file
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/results/download/csv", async (req, res) => {
    try {
        const response = await getVmafResultsCsv(req.query.filename);
        const filenameElements = req.query.filename.split(".");
        res.header("Content-Type", "text/csv");
        res.attachment(`${filenameElements[0]}.csv`);
        return res.send(response);
    } catch (error) {
        hashResponse(res, req, { error: { message: "File does not exisit" }, data: {}, status: false });
    }
});

/**
 * @swagger
 * /vmaf/results/download/json:
 *    get:
 *      description: Get a VMAF results file in a downloadable JSON file.
 *      tags: [vmaf]
 *      produces:
 *        - application/file
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/results/download/json", async (req, res) => {
    const filePath = path.join(__dirname, "..", "data", "vmaf", req.query?.filename || req.body?.filename || "");
    if (fileExists(filePath)) {
        res.download(filePath);
    } else {
        hashResponse(res, req, { error: { message: "File does not exisit" }, data: { file: filePath }, status: false });
    }
});

module.exports = router;
