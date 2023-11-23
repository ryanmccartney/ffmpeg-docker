/*
FFmpeg Docker, an API wrapper around FFmpeg running in a configurable docker container
Copyright (C) 2022 Ryan McCartney

This file is part of the FFmpeg Docker (ffmpeg-docker).

FFmpeg Docker is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

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
            `${options?.input?.file}:${options?.vmaf?.reference}`,
            `VMAF: Compare ${options?.input?.file}  with a reference ${options?.vmaf?.reference}`,
            ["vmaf"]
        );

        const inputFilePath = path.join(__dirname, "..", "data", "media", options?.input?.file);
        const defaultOutputFile = path.join(__dirname, "..", "data", "vmaf", `${job.jobId}.json`);

        if (!(await fileExists(inputFilePath))) {
            response.error = { message: "Input file does not exisit" };
            response.status = false;
            return response;
        }

        let command = ffmpeg({ logger: logger })
            .input(path.join(__dirname, "..", "data", "media", options?.vmaf?.reference))
            .input(inputFilePath)
            .output("-")
            .outputOptions(
                "-lavfi",
                `libvmaf=model_path=${path.join(
                    "/ffmpeg_sources",
                    "vmaf",
                    "model",
                    `${options?.vmaf?.model || "vmaf_v0.6.1.json"}`
                )}:log_fmt=json:psnr=1:ssim=1:ms_ssim=1:log_path=${
                    options?.output?.file || defaultOutputFile
                }:n_threads=${options?.vmaf?.threads || 20}`,
                "-f",
                "null"
            );

        if (options?.thumbnail !== false) {
            command
                .output(path.join(__dirname, "..", "data", "thumbnail", `${job?.jobId}.png`))
                .outputOptions([`-r ${options?.thumbnail?.frequency || 1}`, "-update 1"]);
        }

        command.on("end", () => {
            logger.info("Finished processing");
            jobManager.end(job?.jobId, false);
            command.kill();
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

        command.on("progress", (progress) => {
            logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
            jobManager.update(job?.jobId, { progress: Math.floor(progress.percent) });
        });

        command.on("stderr", (stderrLine) => {
            const vmafScore = parseVMAFScore(stderrLine);
            logger.info("ffmpeg: " + stderrLine);
        });

        command.on("error", (error) => {
            logger.error(error);
            jobManager.end(job?.jobId, false);
        });

        command.run();
    } catch (error) {
        logger.warn(error);
        response.error = error;
        response.status = false;
    }

    response.job = jobManager.get(`${options?.input?.file}:${options?.vmaf?.reference}`);
    return response;
};

module.exports = process;
