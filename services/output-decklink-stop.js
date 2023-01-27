"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

let command;

module.exports = async (cardIndex,options) => {
    let status = true
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    command = ffmpeg({ logger: logger })
    command.kill()

    command.on("error", () => {
        logger.info("FFMPEG process killed");
    });

    command.on("stderr", function (stderrLine) {
        logger.debug("Stderr output: " + stderrLine);
    });

    return { error: status, options: options };
};
