"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");
const jobManager = require("@utils/jobManager");

let command;

module.exports = async (cardIndex, options) => {
    let status = true;
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    const filters = await filterCombine(await filterText(options));

    if (command) {
        logger.info("Killing already running FFMPEG process");
        await command.kill();
    }

    command = ffmpeg({ logger: logger })
        .addInput(`${options.type || "smptehdbars"}=rate=25:size=1920x1080`)
        .inputOptions(["-re", "-f lavfi"])
        .addInput("sine=frequency=1000:sample_rate=48000")
        .inputOptions(["-f lavfi"])
        .outputOptions(["-pix_fmt uyvy422", "-s 1920x1080", "-ac 2", "-f decklink"])
        .output(options.cardName);

    if (Array.isArray(filters)) {
        command.videoFilters(filters);
    }

    command.on("end", () => {
        logger.info("Finished playing file");
    });

    command.on("error", () => {
        logger.info("FFMPEG process killed");
    });

    command.on("start", (commandString) => {
        logger.debug(`Spawned FFmpeg with command: ${commandString}`);
        return { options: options, command: commandString };
    });

    command.on("progress", (progress) => {
        logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
    });

    command.on("stderr", function (stderrLine) {
        logger.info("ffmpeg: " + stderrLine);
    });

    try {
        command.run();
    } catch (error) {
        logger.error(error);
        status = "false";
    }

    return { error: status, options: options };
};
