"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");

let command;

module.exports = async (cardIndex,options) => {
    let status = true

    try{
        ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

        const filters = await filterCombine(await filterText(options));

        if(command){
            logger.info("Killing already running FFMPEG process")
            await command.kill()
        }

        command = ffmpeg({ logger: logger })
            .input(`srt://${options?.address}:${options?.port}?latency=${options?.latency}&mode=${options?.mode ||"caller"}&passphrase=${options.passphrase}`)
            .inputOptions(["-protocol_whitelist","srt,udp,rtp","-stats","-re","-probesize 1M","-analyzeduration 1M"])
            .outputOptions(["-pix_fmt uyvy422","-s 1920x1080","-ac 2","-f decklink","-probesize 32","-analyzeduration 0","-flags low_delay","-bufsize 0","-muxdelay 0","-vsync passthrough"])
            .output(options?.cardName);

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

            if (stderrLine.includes('[srt]')) {
                // Extract the relevant statistics from the line
                const stats = stderrLine.match(/\[srt\]\s(.+)/)[1];
                logger.info('ffmpeg-srt: ', stats);
            }
            else{
                logger.info("ffmpeg: " + stderrLine);
            }
        });

        command.run();
    }
    catch(error){
        logger.warn(error)
        status = "false"
    }

    return { error: status, options: options };
};
