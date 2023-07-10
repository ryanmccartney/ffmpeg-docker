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
        .input(path.join(__dirname, "..", "data", "media", options.filename))
        .inputOptions(["-protocol_whitelist","file,udp,rtp","-stats","-re"])
        .videoCodec("libx264")
        .videoBitrate(options.bitrate)
        .output(`srt://${options.address}:${options.port}?pkt_size=1316&latency=${options.latency}`)
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

    command.on("progress", (progress) => {
        logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
    });

    command.on("stderr", function (stderrLine) {
        logger.info("ffmpeg: " + stderrLine);
    });

    command.run();

    return { options: options };
};
