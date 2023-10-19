"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fileExists = require("@utils/file-exists");
const jobManager = require("@utils/jobManager");

const parseVMAFScore = (output) => {
    // Extract the VMAF score from the FFmpeg output
    const regex = /VMAF score: (\d+(\.\d+)?)/;
    const match = output.match(regex);
    if (match) {
        return parseFloat(match[1]);
    }
    return null;
};

const process = async (options) => {
    let response = { options: options, status: true };

    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(
            `${options?.input?.filename}${options?.reference?.filename}`,
            `VMAF: Compare ${options?.input?.filename}  with a reference ${options?.reference?.filename}`,
            ["vmaf"]
        );

        const inputFilePath = path.join(__dirname, "..", "data", "media", options?.input?.filename);
        const defaultOutputFile = path.join(__dirname, "..", "data", "vmaf", `${job.jobId}.json`);

        if (!(await fileExists(inputFilePath))) {
            response.error = { message: "Input file does not exisit" };
            response.status = false;
            return response;
        }

        const command = ffmpeg({ logger: logger })
            .input(path.join(__dirname, "..", "data", "media", options?.reference?.filename))
            .input(inputFilePath)
            .output("-")
            .outputOptions(
                "-lavfi",
                `libvmaf=model_path=${path.join(
                    "/ffmpeg_sources",
                    "vmaf",
                    "model",
                    `${options?.model || "vmaf_v0.6.1.json"}`
                )}:log_fmt=json:psnr=1:ssim=1:ms_ssim=1:log_path=${path.join(
                    __dirname,
                    "..",
                    "data",
                    "vmaf",
                    options?.output || defaultOutputFile
                )}:n_threads=${options.threads || 20}`,
                "-f",
                "null"
            );

        if (options?.thumbnail) {
            command
                .output(path.join(__dirname, "..", "data", "thumbnail", `${job?.jobId}.png`))
                .outputOptions([`-r ${options?.thumbnailFrequency || 1}`, "-update 1"]);
        }

        command.on("end", () => {
            logger.info("Finished processing");
            jobManager.end(job?.jobId, false);
            command.kill();
        });

        command.on("start", (commandString) => {
            logger.debug(`Spawned FFmpeg with command: ${commandString}`);
            jobManager.update(job?.jobId, { command: commandString, pid: command.ffmpegProc.pid, options: options });
            return { options: options, command: commandString };
        });

        command.on("progress", (progress) => {
            logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
            jobManager.update(job?.jobId, { progress: Math.floor(progress.percent) });
        });

        command.on("stderr", function (stderrLine) {
            const vmafScore = parseVMAFScore(stderrLine);
            logger.info("ffmpeg: " + stderrLine);
        });

        command.on("error", function (error) {
            logger.error(error);
            jobManager.end(job?.jobId, false);
        });

        command.run();
    } catch (error) {
        logger.warn(error);
        response.error = error;
        response.status = false;
    }

    response.job = jobManager.get(`${options.address}:${options.port}`);
    return response;
};

module.exports = process;
