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
            `${options?.output?.address}:${options?.output?.port}`,
            `Bars to RTP rtp://${options?.output?.address}:${options?.output?.port}`,
            ["encode", "rtp", "bars"]
        );

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        const command = ffmpeg({ logger: logger })
            .addInput(`${options?.input?.type || "smptehdbars"}=rate=25:size=1920x1080`)
            .inputOptions(["-re", "-f lavfi"])
            .addInput(`sine=frequency=${options?.input?.frequency || 1000}:sample_rate=48000`)
            .inputOptions(["-f lavfi"])
            .videoCodec("libx264")
            .output(`rtp://${options?.output?.address}:${options?.output?.port}`)
            .outputOptions(["-f rtp"])
            .outputOptions(`-b:v ${options?.output?.bitrate || "5M"}`);

        if (!options.vbr) {
            command.outputOptions([
                `-minrate ${options?.output?.bitrate || "5M"}`,
                `-maxrate ${options?.output?.bitrate || "5M"}`,
                `-muxrate ${options?.output?.bitrate || "5M"}`,
                `-bufsize 500K`,
            ]);
        } else {
            command.outputOptions([
                `-minrate ${options?.output?.minBitrate || "5M"}`,
                `-maxrate ${options?.output?.maxBitrate || "5M"}`,
                `-bufsize 500K`,
            ]);
        }

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

            //If IO Error (Network error, restart)
            if (error.toString().includes("Input/output error") || error.toString().includes("Conversion failed!")) {
                logger.info("Restarting due to IO error");
                process(options);
            }
        });

        command.run();
    } catch (error) {
        logger.error(error.message);
        response.errors = [error];
    }

    response.job = jobManager.get(`${options?.output?.address}:${options?.output?.port}`);
    return response;
};

module.exports = process;