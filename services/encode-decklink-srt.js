"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const jobManager = require("@utils/jobManager");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");

const process = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(
            options.cardName,
            `Encode: ${options.cardName} to SRT srt://${options.address}:${options.port}`,
            ["encode", "srt", "decklink"]
        );

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        const command = ffmpeg({ logger: logger })
            .input(options.cardName)
            .inputFormat("decklink")
            .inputOptions(["-protocol_whitelist", "srt,udp,rtp", "-stats", "-re"])
            .output(
                `srt://${options.address}:${options.port}?pkt_size=${options?.packetSize || 1316}&latency=${
                    parseInt(options?.latency) * 1000 || "250000"
                }&mode=${options?.mode || "caller"}&ipttl=${options?.ttl || "64"}&iptos=${
                    options?.tos || "104"
                }&transtype=${options?.transtype || "live"}`
            )
            .outputOptions(["-preset veryfast", "-f mpegts"])
            .videoCodec("libx264")
            .videoBitrate(options.bitrate);

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
            logger.info("Finished encoding decklink card to SRT");
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

    response.job = await jobManager.get(options.cardName);
    return response;
};

module.exports = process;
