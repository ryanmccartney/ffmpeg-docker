"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fileExists = require("@utils/file-exists");

let command;
let progress = 0;

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
    let response = {options:options, status:true};

    try{
        ffmpeg.setFfmpegPath("/root/bin/ffmpeg");
        
        if(command){
            if(options.kill){
                logger.info("Killing already running FFMPEG process")
                response.data = {}
                response.data.message = `Kill VMAF test`;
                response.data.killed = true;
                await command.kill();
                return response;
            }
            if(command.progress){
                response.data = {}
                response.data.message = `Already running a test ${command.progress}% complete`;
                response.data.progress = command.progress
                return response; 
            }
        }

        const inputFilePath = path.join(__dirname, "..", "data", "media", options?.input?.filename);
        const inputFilePathElements = inputFilePath.split("/");
        const defaultOutputFile = `${inputFilePathElements[inputFilePathElements.length-1].split(".")[0]}.json`

        if(! await fileExists(inputFilePath)){   
            response.error = {message: "Input file does not exisit"};
            response.status = false;
            return response    
        }

        command = ffmpeg({ logger: logger })
            .input(path.join(__dirname, "..", "data", "media", options?.reference?.filename))
            .input(inputFilePath)
            .outputOptions('-lavfi', `libvmaf=model_path=${path.join("/ffmpeg_sources", "vmaf", "model", `${options?.model || "vmaf_v0.6.1.json"}`)}:log_fmt=json:psnr=1:ssim=1:ms_ssim=1:log_path=${path.join(__dirname, "..", "data", "vmaf", options?.output || defaultOutputFile)}:n_threads=${options.threads || 20}`, '-f', 'null')
            .output('-');

        command.on("end", () => {
            logger.info("Finished processing");
            command.progress = 0;
            command.kill();
        });

        command.on("start", (commandString) => {
            logger.debug(`Spawned FFmpeg with command: ${commandString}`);
            return { options: options, command: commandString };
        });

        command.on("progress", (progress) => {
            logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
            command.progress = Math.floor(progress.percent)
        });

        command.on("stderr", function (stderrLine) {
            const vmafScore = parseVMAFScore(stderrLine);
            logger.info("ffmpeg: " + stderrLine);
        });

        command.run();
    }
    catch(error){
        logger.warn(error)
        response.error = error;
        response.status = false;
    }

    return response;
};
