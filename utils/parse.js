"use strict";

const logger = require("@utils/logger")(module);
const Mustache = require("mustache");

const host = process.env.HOST || "localhost";
const port = process.env.PORT || "80";

module.exports = async (inputString,options = {}) => {
    let parsedString = "";
    try {

        const view = {
            ...{
                date: new Date(),
                host: host,
                port: port
            },
            ...options
        };

        parsedString = await Mustache.render(inputString, view);
    } catch (error) {
        logger.warn(error);
    }
    return parsedString;
};