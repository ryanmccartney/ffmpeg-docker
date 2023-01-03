"use strict";

const logger = require("@utils/logger")(module);
const util = require("util");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

module.exports = async (filename) => {
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");
    try {
        const ffprobe = util.promisify(ffmpeg.ffprobe);
        const metadata = await ffprobe(path.join(__dirname, "..", "data", "media", filename));
        return { data: metadata };
    } catch (error) {
        logger.error("Cannot probe media " + error.message);
        return { error: error.toString() };
    }
};
