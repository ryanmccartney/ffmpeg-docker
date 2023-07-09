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
        .outputOptions(["-c:v libx264","-preset ultrafast","-tune zerolatency","-g 30","-c:a aac","-strict experimental","-movflags faststart","-f hls","-hls_time 0.5","-hls_list_size 5","-hls_flags independent_segments"])
        .output(`${path.join(__dirname, "..", "data", "hls", options?.streamName)}`)

    if(Array.isArray(filters)){
        command.videoFilters(filters)
    }
        
    command.on("end", () => {
        logger.info("Finished thumbnailing file");
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