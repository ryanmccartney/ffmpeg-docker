"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const jobManager = require("@utils/jobManager");
const filterCombine = require("@utils/filter-combine");
const filterText = require("@utils/filter-text");
const filterImage = require("@utils/filter-image");
const setCodec = require("@utils/set-codec");

const process = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(
            `${options?.input?.cardName}-in`,
            `${options?.input?.cardName} to UDP udp://${options?.output?.address}:${options?.output?.port}`,
            ["encode", "udp", "decklink"]
        );

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        let command = ffmpeg({ logger: logger })
            .input(options?.input?.cardName)
            .inputFormat("decklink")
            .inputOptions(["-protocol_whitelist", "srt,udp,rtp", "-stats", "-re"])
            .output(
                `udp://${options?.output?.address}:${options?.output?.port}?pkt_size=${
                    options?.output?.packetSize || 1316
                }&buffer_size=${options?.output?.buffer || 65535}`
            )
            .outputOptions([
                `-preset ${options?.output?.encodePreset || "ultrafast"}`,
                "-f mpegts",
                "-flags low_delay",
                "-bufsize 0",
                "-muxdelay 0",
            ])
            .outputOptions(`-b:v ${options?.output?.bitrate || "5M"}`);

        command = setCodec(command, options?.output);

        if (options?.output?.vbr) {
            command.outputOptions([
                `-minrate ${options?.output?.vbr?.minBitrate || "5M"}`,
                `-maxrate ${options?.output?.vbr?.maxBitrate || "5M"}`,
                `-muxrate ${options?.output?.bitrate || "5M"}`,
                `-bufsize 500K`,
            ]);
        }

        if (Array.isArray(filters)) {
            command.videoFilters(filters);
        }

        if (options?.thumbnail !== false) {
            command
                .output(path.join(__dirname, "..", "data", "thumbnail", `${job?.jobId}.png`))
                .outputOptions([`-r ${options?.thumbnail?.frequency || 1}`, "-update 1"]);

            if (Array.isArray(filters)) {
                command.videoFilters(filters);
            }
        }

        command.on("end", () => {
            logger.info("Finished encoding decklink card to UDP");
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

        command.on("stderr", (stderrLine) => {
            logger.info("ffmpeg: " + stderrLine);
        });

        command.on("error", (error) => {
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

    response.job = await jobManager.get(`${options?.input?.cardName}-in`);
    return response;
};

module.exports = process;
