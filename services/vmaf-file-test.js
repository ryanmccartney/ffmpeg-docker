"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const parseVMAFScore = (output) => {
    // Extract the VMAF score from the FFmpeg output
    const regex = /VMAF score: (\d+(\.\d+)?)/;
    const match = output.match(regex);
    if (match) {
      return parseFloat(match[1]);
    }
    return null;
  }

module.exports = async (options) => {
    let status = true;

    try{
        ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

        const command = ffmpeg({ logger: logger })
            .input(path.join(__dirname, "..", "data", "media", options?.reference?.filename))
            .input(path.join(__dirname, "..", "data", "media", options?.input?.filename))
            .outputOptions('-lavfi', `libvmaf=model_path=${path.join("/ffmpeg_sources", "vmaf", "model", options?.model)}:log_fmt=json:psnr=1:ssim=1:ms_ssim=1:log_path=${path.join(__dirname, "..", "data", "vmaf", options?.output)}`, '-f', 'null')
            .output('-');

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
            const vmafScore = parseVMAFScore(stderrLine);
            logger.info("ffmpeg: " + stderrLine);
        });

        command.run();
    }
    catch(error){
        logger.warn(error)
        status = false;
    }

    return { error: status, options: options };
};
