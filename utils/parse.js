"use strict";

const logger = require("@utils/logger")(module);
const Mustache = require("mustache");

const host = process.env.HOST || "localhost";
const queueSize = process.env.QUEUE_SIZE || "10";

const port = process.env.PORT || "80";

module.exports = async (inputString, options = {}) => {
    let parsedString = "";
    try {
        const view = {
            ...{
                date: new Date(),
                host: host,
                port: port,
                queueSize: queueSize.toString(),
            },
            ...options,
        };

        parsedString = await Mustache.render(inputString, view);
    } catch (error) {
        logger.warn(error);
    }
    return parsedString;
};
