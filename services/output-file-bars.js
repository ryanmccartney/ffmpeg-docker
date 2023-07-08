"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");

module.exports = async (options) => {
    let status = true
    try{
        ffmpeg.setFfmpegPath("/root/bin/ffmpeg");
        
        const filters = await filterCombine(await filterText(options));

        const command = ffmpeg({ logger: logger })
            .addInput(`${options?.type||"smptehdbars"}=rate=25:size=1920x1080`)
            .inputOptions(["-f lavfi"])
            .addInput(`sine=frequency=${options?.audio?.frequency||"1000"}:sample_rate=48000`)
            .inputOptions(["-f lavfi"])
            .fps(25)
            .output(path.join(__dirname, "..", "data", "media",`${options?.filename||"test.mp4"}`))
            .outputOptions([`-t ${options?.duration||"10"}`]);

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
            logger.info("Processing: " + progress.percent + "% done");
        });

        command.on("stderr", function (stderrLine) {
            logger.warn("Stderr output: " + stderrLine);
        });

        command.run();
    }
    catch(error){
        logger.warn(error)
        status = false;
    }

    return { error: status, options: options };
};
