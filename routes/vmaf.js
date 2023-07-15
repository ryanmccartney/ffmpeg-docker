"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const getVmafModels = require("@services/vmaf-models-get");
const testVmaf = require("@services/vmaf-file-test");
const getVmafResultsCsv = require("@services/vmaf-results-csv");
const getVmafResultsJson = require("@services/vmaf-results-json");
const path = require("path");
const fileExists = require("@utils/file-exists");
const e = require("express");

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
 *    get:
 *      description: Run a VMAF test specifing a reference file and test file.
 *      tags: [vmaf]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/test", async (req, res, next) => {

    if(req.query.filename){
        req.body.input = {"filename": ""}
        req.body.input.filename = req.query.filename
    }
    if(req.query.reference){
        req.body.reference = {"filename": ""}
        req.body.reference.filename = req.query.reference
    }
    if(req.query.kill){
        req.body.kill = true;
    }

    const response = await testVmaf(req.body);
    hashResponse(res, req, response);
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
router.get('/results/json', async (req, res) => {
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
router.get('/results/csv', async (req, res) => {
    try{
        const response = await getVmafResultsCsv(req.query.filename);
        const filenameElements = req.query.filename.split(".")
        res.header('Content-Type', 'text/csv');
        res.attachment(`${filenameElements[0]}.csv`);
        return res.send(response);
    }
    catch(error){
        hashResponse(res, req, { error: {message:"File does not exisit"}, data:{}, status: false });
    }
  });

/**
 * @swagger
 * /vmaf/results/download:
 *    get:
 *      description: Get a VMAF results file in a downloadable file.
 *      tags: [vmaf]
 *      produces:
 *        - application/file
 *      responses:
 *        '200':
 *          description: Success
 */
router.get('/results/download', async (req, res) => {
    const filePath = path.join(__dirname, "..", "data", "vmaf", req.query?.filename || req.body?.filename || "");
    if(fileExists(filePath)){
        res.download(filePath);
    }else{
        hashResponse(res, req, { error: {message:"File does not exisit"}, data:{file:filePath}, status: false });
    }
  });

module.exports = router;
