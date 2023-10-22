"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");
const setCodec = require("@utils/set-codec");
const jobManager = require("@utils/jobManager");
const getFileExtension = require("@utils/get-extension");

const process = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(
            options.cardName,
            `Encode: ${options.cardName} to file srt://${options.address}:${options.port}`,
            ["decode", "file", "decklink"]
        );

        const fileName = `${options.filename || job.jobId}${getFileExtension(options?.format)}`;

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        let command = ffmpeg({ logger: logger })
            .input(options.cardName)
            .inputFormat("decklink")
            .inputOptions(["-protocol_whitelist", "srt,udp,rtp", "-stats", "-re"]);

        if (options.chunkSize) {
            command
                .outputOptions("-f", "segment")
                .outputOptions("-segment_time", parseInt(options.chunkSize))
                .outputOptions("-reset_timestamps", 1, "-y")
                .output(
                    `${path.join(
                        __dirname,
                        "..",
                        "data",
                        "media",
                        `${fileName.split(".")[0]}-%03d.${fileName.split(".")[1]}`
                    )}`
                );
        } else {
            command.output(`${path.join(__dirname, "..", "data", "media", fileName)}`);
        }

        command = setCodec(command, options);

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
