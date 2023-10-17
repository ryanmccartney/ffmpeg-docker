"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const jobManager = require("@utils/jobManager");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");

module.exports = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(rtmpAddress);
        ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

        const filters = await filterCombine(await filterText(options));

        const command = ffmpeg({ logger: logger })
            .input(options.cardName)
            .inputFormat("decklink")
            .outputOptions([
                "-c:v libx264",
                "-preset ultrafast",
                "-tune zerolatency",
                "-g 30",
                "-c:a aac",
                "-strict experimental",
                "-movflags faststart",
                "-f hls",
                `-hls_time ${options?.hls.chunkTime | 0.5}`,
                `-hls_list_size ${options?.hls.chunks | 5}`,
                "-hls_flags independent_segments",
            ])
            .output(`${path.join(__dirname, "..", "data", "hls", options?.streamName)}`);

        if (Array.isArray(filters)) {
            command.videoFilters(filters);
        }

        command.on("end", () => {
            logger.info("Finished encoding decklink to HLS");
        });

        command.on("start", (commandString) => {
            logger.debug(`Spawned FFmpeg with command: ${commandString}`);
            jobManager.update(job?.jobId, { command: commandString, pid: command.ffmpegProc.pid, options: options });
            return { options: options, command: commandString };
        });

        command.on("stderr", function (stderrLine) {
            logger.info("ffmpeg: " + stderrLine);
        });

        command.on("error", function (error) {
            logger.error(error);
            jobManager.end(job?.jobId, false);

            //If IO Error (Network error, restart)
            if (error.toString().includes("Input/output error") || error.toString().includes("Conversion failed!")) {
                logger.info("Restarting due to IO error");
                process(options);
            }
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
