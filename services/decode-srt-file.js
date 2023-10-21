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
            `${options.address}:${options.port}`,
            `Decode: SRT to file srt://${options.address}:${options.port}`,
            ["decode", "srt"]
        );

        const fileName = `${options.filename || job.jobId}${getFileExtension(options?.format)}`;

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        let command = ffmpeg({ logger: logger })
            .input(
                `srt://${options.address}:${options.port}?pkt_size=${options?.packetSize || 1316}&latency=${
                    parseInt(options?.latency) * 1000 || "250000"
                }&mode=${options?.mode || "caller"}&ipttl=${options?.ttl || "64"}&iptos=${
                    options?.tos || "104"
                }&transtype=${options?.transtype || "live"}&passphrase=${options.passphrase}`
            )
            .inputOptions(["-protocol_whitelist", "srt,udp,rtp", "-stats"]);

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
