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
        .inputOptions(["-protocol_whitelist","srt,udp,rtp","-stats","-re"])
        .videoCodec("libx264")
        .videoBitrate(options.bitrate)
        .output(`srt://${options.address}:${options.port}?pkt_size=1316&latency=${options.latency}`)
        .outputOptions(["-preset ultrafast", "-f mpegts","-protocol_whitelist","srt,udp,rtp","-stats"]);


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
        logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
    });

    command.on("stderr", function (stderrLine) {
        logger.info("ffmpeg: " + stderrLine);

        if (stderrLine.includes('[srt]')) {
            // Extract the relevant statistics from the line
            const stats = stderrLine.match(/\[srt\]\s(.+)/)[1];
            logger.info('ffmpeg-srt: ', stats);
        }
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
