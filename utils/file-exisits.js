"use strict";

const fs = require('fs')
const path = require("path");
const logger = require("@utils/logger")(module);

module.exports = async (relativePath) => {
    try {
        const absolutePath = path.resolve(relativePath);
        console.log(absolutePath)
        if (await fs.existsSync(absolutePath)) {
            console.log(absolutePath)
            return true;
        }
        return false;
      } catch(error) {
        logger.warn(error);
        return false;
      }
};





