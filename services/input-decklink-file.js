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
        .outputOptions(["-c:v libx264","-crf 23","-preset medium"]);
    
    if(options.chunkSize){
        command.outputOptions('-f', 'segment')
            .outputOptions('-segment_time', parseInt(options.chunkSize))
            .outputOptions('-reset_timestamps', 1)
            .output(`${path.join(__dirname, "..", "data", "media", `${options.filename.split(".")[0]}-%03d.${options.filename.split(".")[1]}`)}`);
    }
    else{
        command.output(`${path.join(__dirname, "..", "data", "media", options.filename)}`);
    }

    if(Array.isArray(filters)){
        command.videoFilters(filters)
    }
    
    command.on("end", () => {
        logger.info("Finished recording file");
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
