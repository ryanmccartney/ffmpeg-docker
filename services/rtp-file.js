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
const filterCombine = require("@utils/filter-combine");
const filterText = require("@utils/filter-text");
const filterImage = require("@utils/filter-image");
const setCodec = require("@utils/set-codec");
const jobManager = require("@utils/jobManager");
const getFilePath = require("@utils/get-filepath");

const process = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const job = jobManager.start(
            `${options?.input?.address}:${options?.input?.port}`,
            `RTP to file rtp://${options?.input?.address}:${options?.input?.port}`,
            ["decode", "file", "rtp"]
        );

        const filePath = await getFilePath({
            file: options?.output?.file || job.jobId,
            format: options?.output?.format,
            chunks: options?.output?.chunkSize,
        });

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        let command = ffmpeg({ logger: logger })
            .input(
                `rtp://${options?.input?.address}:${options?.input?.port}?pkt_size=${
                    options?.input?.packetSize || 1316
                }&buffer_size=${options?.input?.buffer || 65535}`
            )
            .inputOptions(["-protocol_whitelist", "srt,udp,rtp", "-stats", "-re"]);

        if (options?.output?.chunkSize) {
            command
                .outputOptions("-f", "segment")
                .outputOptions("-segment_time", parseInt(options?.output?.chunkSize))
                .outputOptions("-reset_timestamps", 1, "-y");
        }

        command.output(filePath);

        //command = setCodec(command, options?.output);

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
            logger.info("Finished processing");
            jobManager.end(job?.jobId, false);
        });

        command.on("start", (commandString) => {
            logger.debug(`Spawned FFmpeg with command: ${commandString}`);
            response.job = jobManager.update(job?.jobId, {
                command: commandString,
                pid: command.ffmpegProc.pid,
                options: options,
                file: filePath,
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

    response.job = jobManager.get(`${options?.input?.address}:${options?.input?.port}`);
    return response;
};

module.exports = process;
