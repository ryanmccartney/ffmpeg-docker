"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");

module.exports = async (options) => {
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    const filters = await filterCombine(await filterText(options));

    const command = ffmpeg({ logger: logger })
        .addInput("smptehdbars=rate=25:size=1920x1080")
        .inputOptions(["-re", "-f lavfi"])
        .addInput("sine=frequency=1000:sample_rate=48000")
        .inputOptions(["-f lavfi"])
        .videoCodec("libx264")
        .videoBitrate(options.bitrate)
        .outputOptions(["-r 4", "-update 1", path.resolve(`./data/srt-thumbnail-${options.address}-${options.port}.png`),])
        .output(`srt://${options.address}:${options.port}?pkt_size=1316&latency=${options.latency}*1000`)
        .outputOptions(["-preset veryfast", "-f mpegts"]);

    if(Array.isArray(filters)){
        command.videoFilters(filters)
    }
        
    command.on("end", () => {
        logger.info("Finished processing");
    });

    command.on("start", (commandString) => {
        logger.debug(`Spawned FFmpeg with command: ${commandString}`);
        return { options: options, command: commandString };
    });

    command.on("stderr", function (stderrLine) {
        logger.info("Stderr output: " + stderrLine);
    });

    command.run();

    return { options: options };
};
