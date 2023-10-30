"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const fs = require("fs");
const util = require("util");

const readdir = util.promisify(fs.readdir);

module.exports = async (options = { types: true }) => {
    try {
        const directoryPath = path.join(__dirname, "data", "media");
        const files = await readdir(directoryPath, { withFileTypes: options?.types });
        return { files: files };
    } catch (error) {
        logger.warn("Cannot list files " + error.message);
        return { error: error.toString() };
    }
};
