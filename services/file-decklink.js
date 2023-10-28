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
    if (options.repeat) {
        repeat = `-stream_loop -1`;
    }

    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(options.cardName, `File to ${options.cardName}`, ["decode", "file", "decklink"]);

        const filters = await filterCombine(await filterText(options));

        const command = ffmpeg({ logger: logger })
            .input(`${path.join(__dirname, "..", "data", "media", options.filename)}`)
            .inputOptions([
                repeat,
                "-protocol_whitelist",
                "file,udp,rtp",
                "-stats",
                "-re",
                "-probesize 32",
                "-analyzeduration 0",
            ])
            .outputOptions([
                "-pix_fmt uyvy422",
                "-s 1920x1080",
                "-ac 16",
                "-f decklink",
                `-af volume=${options?.volume || 0.25}`,
                "-flags low_delay",
                "-bufsize 0",
                "-muxdelay 0",
                "-async 1",
            ])
            .output(options.cardName);

        if (Array.isArray(filters)) {
            command.videoFilters(filters);
        }

        if (options?.thumbnail) {
            command
                .output(path.join(__dirname, "..", "data", "thumbnail", `${job?.jobId}.png`))
                .outputOptions([`-r ${options?.thumbnailFrequency || 1}`, "-update 1"]);

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

        command.on("progress", (progress) => {
            logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
            jobManager.update(job?.jobId, { progress: Math.floor(progress.percent) });
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
        response.error = error.message;
    }

    response.job = await jobManager.get(options.cardName);
    return response;
};

module.exports = process;
