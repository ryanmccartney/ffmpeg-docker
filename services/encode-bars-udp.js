"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");
const jobManager = require("@utils/jobManager");

const process = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(`${options.address}:${options.port}`);

        const filters = await filterCombine(await filterText(options));

        const command = ffmpeg({ logger: logger })
            .addInput(`${options.bars || "smptehdbars"}=rate=25:size=1920x1080`)
            .inputOptions(["-re", "-f lavfi"])
            .addInput(`sine=frequency=${options.frequency | 1000}:sample_rate=48000`)
            .inputOptions(["-f lavfi"])
            .videoCodec("libx264")
            .videoBitrate(options.bitrate)
            .output(
                `udp://${options.address}:${options.port}?pkt_size=${options?.packetSize || 1316}&buffer_size=${
                    options?.buffer || 65535
                }`
            )
            .outputOptions(["-preset veryfast", "-f mpegts"]);

        if (Array.isArray(filters)) {
            command.videoFilters(filters);
        }

        command.on("end", () => {
            logger.info("Finished processing");
            jobManager.end(job?.jobId);
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
