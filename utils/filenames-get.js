"use strict";

const logger = require("@utils/logger")(module);
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

module.exports = async (dirname) => {
    let files = [];
    try {
        files = await fsp.readdir(path.resolve(dirname));
        return files;
    } catch (error) {
        logger.warn(error);
        return files;
    }
};
