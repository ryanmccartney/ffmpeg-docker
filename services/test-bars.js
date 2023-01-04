"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

module.exports = async () => {
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");
    const command = ffmpeg({ logger: logger })
        .addInput("smptehdbars=rate=25:size=1920x1080")
        .inputOptions(["-re", "-f lavfi"])
        .addInput("sine=frequency=1000:sample_rate=48000")
        .inputOptions(["-f lavfi"])
        .fps(25)
        .output(path.join(__dirname, "..", "data", "media", "test.mp4"));

    command.on("end", () => {
        logger.info("Finished processing");
    });

    command.on("start", (commandString) => {
        logger.debug(`Spawned FFMPEG with command: ${commandString}`);
        return { options: options, command: commandString };
    });

    command.on("progress", (progress) => {
        logger.info("Processing: " + progress.percent + "% done");
    });

    command.on("stderr", function (stderrLine) {
        logger.info("Stderr output: " + stderrLine);
    });

    command.run();

    return { test: "test" };
};
