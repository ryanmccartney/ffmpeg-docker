"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const jobManager = require("@utils/jobManager");
const filterCombine = require("@utils/filter-combine");
const filterText = require("@utils/filter-text");
const setCodec = require("@utils/set-codec");

const process = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(
            `${options?.input?.cardName}in`,
            `${options?.input?.cardName} to SRT srt://${options?.output?.address}:${options?.output?.port}`,
            ["encode", "srt", "decklink"]
        );

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        let command = ffmpeg({ logger: logger })
            .input(options?.input?.cardName)
            .inputFormat("decklink")
            .inputOptions([
                "-protocol_whitelist",
                "srt,udp,rtp",
                "-stats",
                "-re",
                "-flags low_delay",
                "-async 1",
                "-duplex_mode",
                `${options?.input?.duplexMode || "unset"}`,
            ])
            .output(
                `srt://${options?.output?.address}:${options?.output?.port}?pkt_size=${
                    options?.output?.packetSize || 1316
                }&latency=${parseInt(options?.output?.latency) * 1000 || "250000"}&mode=${
                    options?.output?.mode || "caller"
                }&ipttl=${options?.output?.ttl || "64"}&iptos=${options?.output?.tos || "104"}&transtype=${
                    options?.output?.transtype || "live"
                }&maxbw==${options?.output?.maxbw || "-1"}&`
            )
            .outputOptions([`-preset ${options?.output?.encodePreset || "ultrafast"}`, "-f mpegts"])
            .outputOptions(`-b:v ${options?.output?.bitrate || "5M"}`);

        command = setCodec(command, options?.output);

        if (!options.output.vbr) {
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
            logger.info("Finished encoding decklink card to SRT");
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

    response.job = await jobManager.get(options?.input?.cardName);
    return response;
};

module.exports = process;
