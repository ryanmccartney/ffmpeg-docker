"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const jobManager = require("@utils/jobManager");
const filterCombine = require("@utils/filter-combine");
const filterText = require("@utils/filter-text");
const filterImage = require("@utils/filter-image");
const setCodec = require("@utils/set-codec");
const fileDelete = require("@utils/file-delete");

const process = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        let job = await jobManager.start(
            options?.input?.cardName,
            `Decklink to HLS (${options?.output?.file || "JobID"}.m3u8)`,
            ["encode", "hls", "decklink"]
        );

        response.hls = `/api/hls/${options?.output?.file || job.jobId}.m3u8`;

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        let command = ffmpeg({ logger: logger })
            .input(options?.input?.cardName)
            .inputFormat("decklink")
            .output(`${path.join(__dirname, "..", "data", "hls", options?.output?.file || job?.jobId)}.m3u8`)
            .outputOptions([
                "-c:v libx264",
                `-preset ${options?.output?.encodePreset || "ultrafast"}`,
                "-tune zerolatency",
                "-g 30",
                "-c:a aac",
                "-strict experimental",
                "-movflags faststart",
                "-f hls",
                `-hls_time ${options?.output?.chunkDuration | 0.5}`,
                `-hls_list_size ${options?.output?.chunks | 5}`,
                "-hls_flags independent_segments",
            ]);

        command = setCodec(command, options?.output);

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
            logger.info("Finished encoding decklink to HLS");
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

        command.on("stderr", function (stderrLine) {
            logger.info("ffmpeg: " + stderrLine);

            //If new TS file writing
            if (stderrLine.includes(`.ts' for writing`)) {
                job = jobManager.update(job?.jobId, { chunks: (job.chunks || 0) + 1 });
                const totalChunks = options?.output?.chunks || 5;

                if (job.chunks > totalChunks + 1) {
                    fileDelete(`data/hls/${options?.output?.file || job.jobId}${job.chunks - 7}.ts`);
                }
            }
        });

        command.run();
    } catch (error) {
        logger.error(error.message);
        response.errors = [error];
    }

    response.job = await jobManager.get(options?.input?.cardName);
    return response;
};

module.exports = process;
