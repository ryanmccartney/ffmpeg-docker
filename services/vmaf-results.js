"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const fs = require('fs');

const get = async (filePath) => {
    try{
        const contents = await fs.readFileSync(filePath);
        return contents.toString();
    }
    catch(error){
        logger.warn(error)
        return false
    }
};

module.exports = async (filename) => {
    let data = false;

    try{
        const dataString = await get(path.join(__dirname, "..", "data", "vmaf", filename));
        console.log(dataString)
        data = JSON.parse(dataString)
    }
    catch(error){
        logger.warn(error)
    }

    return data;
};
