"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

let command;

module.exports = async (cardIndex, options) => {
    logger.info(`Stopping the output on Decklink Device ${cardIndex}.`);
    let status = true;
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    command = ffmpeg({ logger: logger });
    command.kill();

    command.on("error", () => {
        logger.info("FFmpeg process killed");
    });

    command.on("stderr", function (stderrLine) {
        logger.debug("Stderr output: " + stderrLine);
    });

    return { error: status, options: options };
};
