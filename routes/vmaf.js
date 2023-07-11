"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const getVmafModels = require("@services/vmaf-models-get");
const testVmaf = require("@services/vmaf-file-test");

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
    const response = await testVmaf(req.body);
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});


module.exports = router;
