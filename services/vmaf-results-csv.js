"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const fs = require('fs');
const vmafJsonCsv = require("@utils/vmaf-json-csv");

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
    let csvData = false;

    try{
        const dataString = await get(path.join(__dirname, "..", "data", "vmaf", filename));
        const jsonData = JSON.parse(dataString)
        csvData = await vmafJsonCsv(jsonData)
    }
    catch(error){
        logger.warn(error)
    }

    return csvData;
};
