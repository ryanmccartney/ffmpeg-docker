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
    let repeat = "";
    let inPoint = "00:00:00.000";

    try{

        ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

        const filters = await filterCombine(await filterText(options));

        if(options.repeat){
            repeat = "-stream_loop -1"
        }

        if(options.state === "play"){
            logger.info("Playing Playback")
        }
        else if(options.state === "pause" && command){
            logger.info("Pausing Playback")
            //inPoint = command.time;
            await command.kill('SIGSTOP')
        }
        else if(options.state === "resume" && command){
            logger.info("Resuming Playback")
            await command.kill('SIGCONT')
        }
        if(options.state === "restart" && command){
            logger.info("Restarting Playback");
            await command.kill();
            inPoint = "00:00:00.000";
        }
        
        if(options.state === "restart" || !command){

            //`-ss ${inPoint}`

            command = ffmpeg({ logger: logger })
                .input(`${path.join(__dirname, "..", "data", "media", options.filename)}`)
                .inputOptions(["-re", repeat,"-probesize 32","-analyzeduration 0"])
                .outputOptions(["-timecode 00:00:00:00","-pix_fmt uyvy422","-s 1920x1080","-ac 2","-f decklink",`-af volume=${options?.volume || 0.1}`,"-probesize 32","-analyzeduration 0","-flags low_delay","-bufsize 0","-muxdelay 0","-vsync passthrough"])
                .output(options.cardName);
                
            if(Array.isArray(filters)){
                command.videoFilters(filters)
            }
                
            // if(options?.qr){
            //     command = await filterQr(command, options.qr);
            // }

            command.on("end", () => {
                logger.info("Finished playing file");
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
                const elements = stderrLine.split(" ");
                const regex = /^time=\d{2}:\d{2}:\d{2}\.\d{2}$/;
                if (regex.test(elements[8])) {
                    const time = elements[8].split("=");
                    command.time = time[1]
                } 
                logger.info("ffmpeg: " + stderrLine);
            });

            command.run();
        }
    }
    catch(error){
        logger.warn(error)
        status = "false"
    }

    return { error: status, options: options };
};
