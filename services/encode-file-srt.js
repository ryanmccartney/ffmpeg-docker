"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const filterCombine = require("@services/filter-combine");
const filterText = require("@services/filter-text");
const jobManager = require("@utils/jobManager");

const process = async (options) => {
    const response = { options: options };
    let repeat = "-stream_loop 0";
    if (options.repeat) {
        repeat = `-stream_loop -1`;
    }

    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(
            `${options.address}:${options.port}`,
            `Encode: File to SRT srt://${options.address}:${options.port}`,
            ["encode", "srt"]
        );
        const filters = await filterCombine(await filterText({ ...options, ...job }));

        const command = ffmpeg({ logger: logger })
            .input(path.join(__dirname, "..", "data", "media", options.filename))
            .inputOptions([repeat, "-protocol_whitelist", "file,udp,rtp", "-stats", "-re"])
            .output(
                `srt://${options.address}:${options.port}?pkt_size=${options?.packetSize || 1316}&latency=${
                    parseInt(options?.latency) * 1000 || "250000"
                }&mode=${options?.mode || "caller"}&ipttl=${options?.ttl || "64"}&iptos=${
                    options?.tos || "104"
                }&transtype=${options?.transtype || "live"}&maxbw==${options?.maxbw || "-1"}&`
            )
            .outputOptions(["-preset veryfast", "-f mpegts"])
            .videoCodec("libx264")
            .outputOptions(`-b:v ${options?.bitrate || "5M"}`);

        if (!options.vbr) {
            command.outputOptions([
                `-minrate ${options?.bitrate || "5M"}`,
                `-maxrate ${options?.bitrate || "5M"}`,
                `-muxrate ${options?.bitrate || "5M"}`,
                `-bufsize 500K`,
            ]);
        } else {
            command.outputOptions([
                `-minrate ${options?.minBitrate || "5M"}`,
                `-maxrate ${options?.maxBitrate || "5M"}`,
                `-bufsize 500K`,
            ]);
        }

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
            return response;
        });

        command.on("progress", (progress) => {
            logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
            jobManager.update(job?.jobId, { progress: Math.floor(progress.percent) });
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
