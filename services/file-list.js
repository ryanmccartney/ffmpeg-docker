"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const fs = require("fs");
const util = require("util");

const readdir = util.promisify(fs.readdir);

module.exports = async (options = { extension: true }) => {
    try {
        const directoryPath = path.join(process.cwd(), "data", "media");
        const files = await readdir(directoryPath, { withFileTypes: options?.extension });
        return { files: files };
    } catch (error) {
        logger.warn("Cannot list files " + error.message);
        return { error: error.toString() };
    }
};
