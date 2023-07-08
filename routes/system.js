"use strict";

const router = require("express").Router();
const hashResponse = require("@utils/hash-response");
const setTime = require("@services/system-time-set");

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
    const response = await setTime(req.body.server)
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
        data:{
            datatime:dateTimeObject,
            date:dateTimeObject.toDateString(),
            time:dateTimeObject.toTimeString()
        }
    };
    hashResponse(res, req, response);
});


module.exports = router;
