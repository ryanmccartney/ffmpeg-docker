"use strict";

const logger = require("@utils/logger")(module);
const getFilenames = require("@utils/filenames-get");

module.exports = async () => {
    try {
        const data = await getFilenames("/ffmpeg_sources/vmaf/model");
        return {data:data};
    } catch (error) {
        logger.warn("Cannot probe media " + error.message);
        return { error: error.toString() };
    }
};
