"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");

const getRtmpAddress = (address, key) => {
    let fullAddress = `rtmp://${address}`;
    if (key) {
        fullAddress += `/${key}`;
    }
    return fullAddress;
};

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
        .input(options.cardName)
        .inputFormat("decklink")
        .inputOptions(["-protocol_whitelist", "srt,udp,rtp", "-stats", "-re"])
        .videoCodec("libx264")
        .videoBitrate(options.bitrate)
        .outputOptions(["-r 2", "-update 1", path.resolve(`./data/rtmp-thumbnail-${options.address}.png`)])
        .output(getRtmpAddress(options.address, options.key))
        .outputOptions(["-f flv"]);

    if (Array.isArray(filters)) {
        command.videoFilters(filters);
    }

    command.on("end", () => {
        logger.info("Finished encoding decklink card to RTMP");
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
        logger.warn(error);
        status = "false";
    }

    return { error: status, options: options };
};
