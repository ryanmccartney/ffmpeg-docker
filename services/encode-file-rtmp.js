"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");
const jobManager = require("@utils/jobManager");
const getRtmpAddress = require("@utils/rtmp-address");

const process = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const rtmpAddress = getRtmpAddress(options.address, options.key);
        const job = jobManager.start(rtmpAddress);

        const filters = await filterCombine(await filterText(options));

        const command = ffmpeg({ logger: logger })
            .input(path.join(__dirname, "..", "data", "media", options.filename))
            .inputOptions(["-re"])
            .videoCodec("libx264")
            .videoBitrate(options.bitrate)
            .videoFilters(filterCombine(filterText(options)))
            .outputOptions(["-r 4", "-update 1", path.resolve(`./data/rtmp-thumbnail-${options.address}.png`)])
            .output(rtmpAddress)
            .outputOptions(["-f flv"]);

        if (Array.isArray(filters)) {
            command.videoFilters(filters);
        }

        command.on("end", () => {
            logger.info("Finished processing");
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
