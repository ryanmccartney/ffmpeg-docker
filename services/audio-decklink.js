"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@utils/filter-combine");
const filterText = require("@utils/filter-text");
const jobManager = require("@utils/jobManager");

const process = async (options) => {
    const response = { options: options };
    let repeat = "-stream_loop 0";
    if (options?.input?.repeat) {
        repeat = `-stream_loop -1`;
    }

    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    const audioFilePath = path.join(__dirname, "..", "data", "media", options?.input?.file);

    try {
        const job = jobManager.start(options?.output?.cardName, `File to ${options?.output?.cardName}`, [
            "audio",
            "file",
            "decklink",
        ]);

        const filters = await filterCombine(await filterText({ ...options, ...job }));
        const command = ffmpeg({ logger: logger })
            .input(audioFilePath)
            .inputOptions([`-re`, repeat])
            .addInput(`${options?.input?.type || "smptehdbars"}=rate=25:size=1920x1080`)
            .inputOptions(["-re", "-f lavfi"])
            .outputOptions("-ar 48000")
            .outputOptions("-shortest")
            .outputOptions([
                "-pix_fmt uyvy422",
                "-s 1920x1080",
                "-ac 2",
                "-f decklink",
                `-af volume=${options?.output?.volume || 0.1}`,
                "-probesize 32",
                "-analyzeduration 0",
                "-flags low_delay",
                "-bufsize 0",
                "-muxdelay 0",
                "-vsync passthrough",
            ])
            .output(options?.output?.cardName);

        if (Array.isArray(filters)) {
            command.videoFilters(filters);
        }

        if (options?.thumbnail) {
            command
                .output(path.join(__dirname, "..", "data", "thumbnail", `${job?.jobId}.png`))
                .outputOptions([`-r ${options?.thumbnail?.frequency || 1}`, "-update 1"]);

            if (Array.isArray(filters)) {
                command.videoFilters(filters);
            }
        }

        command.on("end", () => {
            logger.info("Finished processing");
            jobManager.end(job?.jobId, false);
        });

        command.on("start", (commandString) => {
            logger.debug(`Spawned FFmpeg with command: ${commandString}`);
            response.job = jobManager.update(job?.jobId, {
                command: commandString,
                pid: command.ffmpegProc.pid,
                options: options,
            });
            return response;
        });

        command.on("stderr", function (stderrLine) {
            logger.info("ffmpeg: " + stderrLine);
        });

        command.on("error", function (error) {
            logger.error(error);
            jobManager.end(job?.jobId, false);
        });

        command.run();
    } catch (error) {
        logger.error(error.message);
        response.errors = [error];
    }

    response.job = await jobManager.get(options.input?.cardName);
    return response;
};

module.exports = process;