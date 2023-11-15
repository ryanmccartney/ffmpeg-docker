"use strict";

const ffmpeg = require("fluent-ffmpeg");
const util = require("util");
const logger = require("@utils/logger")(module);

module.exports = async (relativePath) => {
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");
    const getAvailableCodecs = util.promisify(ffmpeg.getAvailableCodecs);

    try {
        const codecs = await getAvailableCodecs();
        return codecs;
    } catch (error) {
        logger.warn(error);
        return {};
    }
};
