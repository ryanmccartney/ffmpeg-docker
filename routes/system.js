"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const testBars = require("@services/test-bars");

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
 * /system/test:
 *    get:
 *      description: Test route, API greets you in response.
 *      tags: [system]
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *          description: Success
 */
router.get("/test", async (req, res, next) => {
    const response = await testBars();
    hashResponse(res, req, { data: response, status: response ? "success" : "error" });
});

module.exports = router;
