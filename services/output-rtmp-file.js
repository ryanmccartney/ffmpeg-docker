"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");
const jobManager = require("@utils/jobManager");

const getRtmpAddress = (address, key) => {
    let fullAddress = `rtmp://${address}`;
    if (key) {
        fullAddress += `/${key}`;
    }
    return fullAddress;
};

module.exports = async (options) => {
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    const filters = await filterCombine(await filterText(options));

    const command = ffmpeg({ logger: logger })
        .input(path.join(__dirname, "..", "data", "media", options.filename))
        .inputOptions(["-re"])
        .videoCodec("libx264")
        .videoBitrate(options.bitrate)
        .videoFilters(filterCombine(filterText(options)))
        .outputOptions(["-r 4", "-update 1", path.resolve(`./data/rtmp-thumbnail-${options.address}.png`)])
        .output(getRtmpAddress(options.address, options.key))
        .outputOptions(["-f flv"]);

    if (Array.isArray(filters)) {
        command.videoFilters(filters);
    }

    command.on("end", () => {
        logger.info("Finished processing");
    });

    command.on("start", (commandString) => {
        logger.debug(`Spawned FFmpeg with command: ${commandString}`);
        jobManager.update(job?.jobId, { command: commandString, pid: command.ffmpegProc.pid });
        return { options: options, command: commandString };
    });

    command.on("progress", (progress) => {
        logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
    });

    command.on("stderr", function (stderrLine) {
        logger.info("ffmpeg: " + stderrLine);
    });

    command.run();

    return { options: options };
};
