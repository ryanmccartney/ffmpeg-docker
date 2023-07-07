"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

let command;

module.exports = async (cardIndex,options) => {
    let status = true
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    if(command){
        logger.info("Killing already running FFMPEG process")
        await command.kill()
    }

    command = ffmpeg({ logger: logger })
        .addInput(`${options.type||"smptehdbars"}=rate=25:size=1920x1080`)
        .inputOptions(["-re", "-f lavfi"])
        .addInput("sine=frequency=1000:sample_rate=48000")
        .inputOptions(["-f lavfi"])
        .videoFilters([
            {
                filter: "drawtext",
                options: `fontfile=\'${path.join(
                    __dirname,
                    "..",
                    "public",
                    "fonts",
                    `${options.font || "swansea-bold.ttf"}`
                )}:\'text=\'${
                    options.line1
                }\':fontcolor=white:fontsize=100:box=1:boxcolor=black@0.5:boxborderw=8:x=(w-text_w)/2:y=((h-text_h)/2)-60`,
            },
            {
                filter: "drawtext",
                options: `fontfile=\'${path.join(
                    __dirname,
                    "..",
                    "public",
                    "fonts",
                    `${options.font || "swansea-bold.ttf"}`
                )}:\'text=\'${
                    options.line2
                }\':fontcolor=white:fontsize=100:box=1:boxcolor=black@0.5:boxborderw=8:x=(w-text_w)/2:y=((h-text_h)/2)+60`,
            },
            {
                filter: "drawtext",
                options: `fontfile=\'${path.join(
                    __dirname,
                    "..",
                    "public",
                    "fonts",
                    `${options.font || "swansea-bold.ttf"}`
                )}:\'text=\'%{pts\\:gmtime\\:${
                    Date.now() / 1000
                }}\':fontcolor=white:fontsize=100:box=1:boxcolor=black@0.5:boxborderw=8:x=(w-text_w)/2:y=((h-text_h)/2)+180`,
            },
        ])
        //.outputOptions(["-r 2", "-update 1", path.resolve(`./data/decklink-thumbnail-${cardIndex}.png`),])
        .outputOptions(["-pix_fmt uyvy422","-s 1920x1080","-ac 2","-f decklink"])
        .output(options.cardName);

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
        logger.info("Processing: " + Math.floor(progress.percent) + "% done");
    });

    command.on("stderr", function (stderrLine) {
        logger.info("Stderr output: " + stderrLine);
    });

    try{
        command.run();
    }
    catch(error){
        logger.error(error)
        status = "false"
    }

    return { error: status, options: options };
};
