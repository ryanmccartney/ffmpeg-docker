"use strict";

const logger = require("@utils/logger")(module);
const util = require("util");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

module.exports = async (file) => {
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");
    try {
        const ffprobe = util.promisify(ffmpeg.ffprobe);
        const metadata = await ffprobe(path.join(__dirname, "..", "data", "media", file));
        return { data: metadata };
    } catch (error) {
        logger.warn("Cannot probe media " + error.message);
        return { errors: [error] };
    }
};
