"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@utils/filter-combine");
const filterText = require("@utils/filter-text");

let command;

//ffmpeg -ss 00:00:10 -i input.mp4 -vf "select='eq(n,0)',setpts=N/FRAME_RATE/TB" -r 25 -f decklink 'Decklink Output'

module.exports = async (cardIndex, options) => {
    let status = true;
    let repeat = "";
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    const filters = await filterCombine(await filterText({ ...options, ...job }));

    if (options?.input?.repeat) {
        repeat = "-stream_loop -1";
    }

    if (command) {
        logger.info("Killing already running FFMPEG process");
        await command.kill();
    }
    command = ffmpeg({ logger: logger })
        .input(`${path.join(__dirname, "..", "data", "media", options.file)}`)
        .seekInput(options.timestamp)
        .complexFilter([
            {
                filter: "split",
                options: "2",
                outputs: ["selected", "dummy"],
            },
            {
                filter: "trim",
                options: "start_frame=0:end_frame=0",
                inputs: "selected",
                outputs: "output",
            },
            {
                filter: "setpts",
                options: "PTS-STARTPTS",
                inputs: "output",
            },
        ])
        // .inputOptions([`-re`,repeat])
        // .outputOptions(["-pix_fmt uyvy422","-s 1920x1080","-ac 2","-f decklink"])
        .output(options.cardName)
        .outputOptions(["-r 25", "-f decklink", "-format_code 8", "-pix_fmt uyvy422"]);
    //.outputOptions(["-pix_fmt uyvy422","-s 1920x1080","-ac 2","-f decklink"]);

    if (Array.isArray(filters)) {
        command.videoFilters(filters);
    }

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
        logger.info("ffmpeg: " + stderrLine);
    });

    try {
        command.run();
    } catch (error) {
        logger.warn(error);
        status = "false";
    }

    return { error: status, options: options };
};
