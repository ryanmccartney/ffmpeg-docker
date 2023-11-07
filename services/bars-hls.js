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
        const job = jobManager.start(
            `${options?.output?.file || options.toString()}`,
            `Bars to HLS (${options?.output?.file || "JobID"}.m3u8)`,
            ["encode", "hls"]
        );

        response.hls = `/api/hls/${options?.output?.file || job.jobId}.m3u8`;

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        const command = ffmpeg({ logger: logger })
            .addInput(`${options.input?.type || "smptehdbars"}=rate=25:size=1920x1080`)
            .inputOptions(["-re", "-f lavfi"])
            .addInput(`sine=frequency=${options.input.frequency || 1000}:sample_rate=48000`)
            .inputOptions(["-f lavfi"])
            .output(`${path.join(__dirname, "..", "data", "hls", options?.output?.file || job.jobId)}.m3u8`)
            .outputOptions([
                "-c:v libx264",
                `-preset ${options?.output?.encodePreset || "ultrafast"}`,
                "-tune zerolatency",
                "-g 30",
                "-c:a aac",
                "-strict experimental",
                "-movflags faststart",
                "-f hls",
                `-hls_time ${options?.output?.chunkDuration || 0.5}`,
                `-hls_list_size ${options?.output?.chunks || 5}`,
                "-hls_flags independent_segments",
            ]);

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
            logger.info("Finished encoding bars to HLS");
            jobManager.end(job?.jobId, false);
        });

        command.on("start", (commandString) => {
            logger.debug(`Spawned FFmpeg with command: ${commandString}`);
            jobManager.update(job?.jobId, { command: commandString, pid: command.ffmpegProc.pid, options: options });
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

    response.job = jobManager.get(`${options?.output?.file || options.toString()}`);
    return response;
};

module.exports = process;
