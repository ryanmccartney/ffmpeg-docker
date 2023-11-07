"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@utils/filter-combine");
const filterText = require("@utils/filter-text");
const jobManager = require("@utils/jobManager");
const setCodec = require("@utils/set-codec");

const process = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(options.cardName, `UDP to ${options.cardName}`, ["decode", "udp", "decklink"]);

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        let command = ffmpeg({ logger: logger })
            .input(
                `udp://${options.address}:${options.port}?pkt_size=${options?.packetSize || 1316}&buffer_size=${
                    options?.buffer || 65535
                }`
            )
            .inputOptions([
                "-protocol_whitelist",
                "srt,udp,rtp",
                "-stats",
                "-re",
                "-probesize 1M",
                "-analyzeduration 1M",
            ])
            .outputOptions([
                "-pix_fmt uyvy422",
                "-s 1920x1080",
                "-ac 16",
                "-f decklink",
                `-af volume=${options?.volume || 0.25}`,
                "-flags low_delay",
                "-bufsize 0",
                "-muxdelay 0",
                "-async 1",
            ])
            .output(options.cardName);

        command = setCodec(command, options);

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

    response.job = await jobManager.get(options.cardName);
    return response;
};

module.exports = process;
