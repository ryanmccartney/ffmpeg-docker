"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");

let command;

module.exports = async (cardIndex,options) => {
    let status = true
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    const filters = await filterCombine(await filterText(options));

    if(command){
        logger.info("Killing already running FFMPEG process")
        await command.kill()
    }

    command = ffmpeg({ logger: logger })
        .input(options.cardName)
        .inputFormat('decklink')
        .inputOptions(["-re"])
        .videoCodec("libx264")
        .videoBitrate(options.bitrate)
        .output(`srt://${options.address}:${options.port}?pkt_size=1316&latency=${options.latency}*1000`)
        .outputOptions(["-preset veryfast", "-f mpegts"]);

    if(Array.isArray(filters)){
        command.videoFilters(filters)
    }
               
    command.on("end", () => {
        logger.info("Finished encoding decklink card to SRT");
    });

    command.on("error", () => {
        logger.info("FFMPEG process killed");
    });

    command.on("start", (commandString) => {
        logger.debug(`Spawned FFmpeg with command: ${commandString}`);
        return { options: options, command: commandString };
    });

    command.on("progress", (progress) => {
        logger.info("Processing: " + Math.floor(progress.percent) + "% done");
    });

    command.on("stderr", function (stderrLine) {
        logger.info("Stderr output: " + stderrLine);
    });

    try{
        command.run();
    }
    catch(error){
        logger.warn(error)
        status = "false"
    }

    return { error: status, options: options };
};
