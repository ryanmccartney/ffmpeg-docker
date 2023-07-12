"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");
const filterQr = require("@services/filter-qr");

let command;

module.exports = async (cardIndex,options) => {
    let status = true
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    const filters = await filterCombine(await filterText(options),await filterQr(options.qr));

    if(command){
        logger.info("Killing already running FFMPEG process")
        await command.kill()
    }

    command = ffmpeg({ logger: logger })
        .input(options.cardName)
        .inputFormat('decklink')
    
    if(options.chunkSize){
        command.outputOptions('-f', 'segment')
            .outputOptions('-segment_time', parseInt(options.chunkSize))
            .outputOptions('-reset_timestamps', 1)
            .output(`${path.join(__dirname, "..", "data", "media", `${options.filename.split(".")[0]}-%03d.${options.filename.split(".")[1]}`)}`);
    }
    else{
        command.output(`${path.join(__dirname, "..", "data", "media", options.filename)}`);
    }

    if(options.format === "prores"){
        command.videoCodec('prores_ks')
            .outputOptions('-profile:v', '3')
            .outputOptions('-c:a', 'pcm_s16le');
    }

    if(options.format === "h264"){
        command.videoCodec('libx264')
            .videoCodec('libx264')
            .outputOptions('-crf', '23')
            .outputOptions('-preset', 'ultrafast');
    }

    if(options.format === "mjpeg"){
        command.videoCodec('mjpeg')
        .outputOptions('-q:v', '10')
        .outputOptions('-c:a', 'copy')
        .addOutputOptions('-pix_fmt', 'yuvj422p')
    }

    if(!options.format){
        command.videoCodec('libx264')
            .videoCodec('libx264')
            .outputOptions('-crf', '23')
            .outputOptions('-preset', 'ultrafast');
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
        logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
    });

    command.on("stderr", function (stderrLine) {
        logger.info("ffmpeg: " + stderrLine);
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
