"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@utils/filter-combine");
const filterText = require("@utils/filter-text");
const jobManager = require("@utils/jobManager");

const process = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");
    try {
        const outputPath = path.join(__dirname, "..", "data", "media", `${options?.filename || "test.mp4"}`);
        const job = jobManager.start(outputPath, `Bars to File (${options?.filename || "test.mp4"})`, ["bars", "file"]);

        const filters = await filterCombine(await filterText(options));

        const command = ffmpeg({ logger: logger })
            .addInput(`${options?.type || "smptehdbars"}=rate=25:size=1920x1080`)
            .inputOptions(["-f lavfi"])
            .addInput(`sine=frequency=${options?.audio?.frequency || "1000"}:sample_rate=48000`)
            .inputOptions(["-f lavfi"])
            .fps(25)
            .output(outputPath)
            .outputOptions([`-t ${options?.duration || "10"}`]);

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
