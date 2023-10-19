"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");
const jobManager = require("@utils/jobManager");

const process = async (options) => {
    const response = { options: options };
    let repeat = "-stream_loop 0";
    if (options.repeat) {
        repeat = `-stream_loop -1`;
    }

    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(
            `${options?.output || path.join(__dirname, "..", "data", "media", options.filename)}`,
            `Encode: File to HLS (${options?.output || "JobID"}.m3u8)`,
            ["encode", "hls"]
        );

        response.hls = `/api/hls/${options?.output || job.jobId}.m3u8`;

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        const command = ffmpeg({ logger: logger })
            .input(path.join(__dirname, "..", "data", "media", options.filename))
            .inputOptions([
                repeat,
                "-protocol_whitelist",
                "file,udp,rtp",
                "-stats",
                "-re",
                "-probesize 32",
                "-analyzeduration 0",
            ])
            .output(`${path.join(__dirname, "..", "data", "hls", options?.output || job.jobId)}.m3u8`)
            .outputOptions([
                "-c:v libx264",
                "-preset ultrafast",
                "-tune zerolatency",
                "-g 30",
                "-c:a aac",
                "-strict experimental",
                "-movflags faststart",
                "-f hls",
                `-hls_time ${options?.hls?.chunkTime | 0.5}`,
                `-hls_list_size ${options?.hls?.chunks | 5}`,
                "-hls_flags independent_segments",
            ]);

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
            logger.info("Finished encoding bars to HLS");
            jobManager.end(job?.jobId, false);
        });

        command.on("start", (commandString) => {
            logger.debug(`Spawned FFmpeg with command: ${commandString}`);
            jobManager.update(job?.jobId, { command: commandString, pid: command.ffmpegProc.pid, options: options });
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

    response.job = jobManager.get(`${options.address}:${options.port}`);
    return response;
};

module.exports = process;
