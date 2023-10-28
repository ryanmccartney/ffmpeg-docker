"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@utils/filter-combine");
const filterText = require("@utils/filter-text");
const filterQr = require("@utils/filter-qr");
const getMetadata = require("@services/metadata-get");
const jobManager = require("@utils/jobManager");

let command;

module.exports = async (cardIndex, options) => {
    let status = true;
    let repeat = "";
    const outputFPS = 25;
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    if (options.repeat) {
        repeat = "-stream_loop -1";
    }

    if (command) {
        logger.info("Killing already running FFMPEG process");
        await command.kill();
    }

    const audioFilePath = path.join(__dirname, "..", "data", "media", options?.filename);

    const metadata = await getMetadata(options?.filename);
    const tags = metadata?.data?.format?.tags;
    const filters = await filterCombine(await filterText({ ...options, ...tags }));

    console.log();
    command = ffmpeg({ logger: logger }).input(audioFilePath).inputOptions([`-re`, repeat]);

    if (options.type === "image") {
        const backgroundFilePath = path.join(__dirname, "..", "data", "media", options?.background || "test.png");
        command.input(backgroundFilePath).inputOptions([`-loop 1`]);
    } else {
        command.addInput(`${options.type || "smptehdbars"}=rate=25:size=1920x1080`).inputOptions(["-re", "-f lavfi"]);
    }

    command.outputOptions("-ar 48000");
    command
        .outputOptions("-shortest")
        .outputOptions([
            "-pix_fmt uyvy422",
            "-s 1920x1080",
            "-ac 2",
            "-f decklink",
            `-af volume=${options?.volume || 0.1}`,
            "-probesize 32",
            "-analyzeduration 0",
            "-flags low_delay",
            "-bufsize 0",
            "-muxdelay 0",
            "-vsync passthrough",
        ])
        .output(options.cardName);

    if (Array.isArray(filters)) {
        command.videoFilters(filters);
    }

    // if(options?.qr){
    //     command = await filterQr(command, options.qr);
    // }

    command.on("end", () => {
        logger.info("Finished playing file");
    });

    command.on("error", (error) => {
        logger.warn(error);
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

    return { error: status, tags: tags, options: options };
};
