"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const getVmafModels = require("@services/vmaf-models-get");
const testVmaf = require("@services/vmaf-file-test");
const getVmafResults = require("@services/vmaf-results");
const path = require("path");
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
 * /vmaf/results/download:
 *    get:
 *      description: Get a VMAF results file.
 *      tags: [vmaf]
 *      produces:
 *        - application/file
 *      responses:
 *        '200':
 *          description: Success
 */
router.get('/results', async (req, res) => {
    const response = await getVmafResults(req.query.filename);
    hashResponse(res, req, { data: response, status: response ? true : false });
});

/**
 * @swagger
 * /vmaf/results:
 *    get:
 *      description: Get a VMAF results file.
 *      tags: [vmaf]
 *      produces:
 *        - application/file
 *      responses:
 *        '200':
 *          description: Success
 */
router.get('/results/download', async (req, res) => {
    const filePath = path.join(__dirname, "..", "data", "vmaf", req.query?.filename || "");
    if(fileExists(filePath)){
        res.download(filePath);
    }
    hashResponse(res, req, { error: {message:"File does not exisit"}, data:{file:filePath}, status: false });
  });

module.exports = router;
