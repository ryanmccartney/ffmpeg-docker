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
const jobManager = require("@utils/jobManager");
const setCodec = require("@utils/set-codec");

const process = async (options) => {
    const response = { options: options };
    let repeat = "-stream_loop 0";
    if (options?.input?.repeat) {
        repeat = `-stream_loop -1`;
    }

    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    const audioFilePath = path.join(__dirname, "..", "data", "media", options?.input?.file);

    try {
        const job = jobManager.start(
            `${options?.output?.address}:${options?.output?.port}`,
            `Audio file to rtp://${options?.output?.address}:${options?.output?.port}`,
            ["audio", "file", "rtp"]
        );

        const filters = await filterCombine(await filterText({ ...options, ...job }));
        let command = ffmpeg({ logger: logger })
            .input(audioFilePath)
            .inputOptions([`-re`, repeat])
            .addInput(`${options?.input?.type || "smptehdbars"}=rate=25:size=1920x1080`)
            .inputOptions(["-re", "-f lavfi"])
            .outputOptions("-ar 48000")
            .outputOptions("-shortest")
            .outputFormat("rtp_mpegts")
            .output(
                `rtp://${options?.output?.address}:${options?.output?.port}?pkt_size=${
                    options?.output?.packetSize || 1316
                }&buffer_size=${options?.output?.buffer || 65535}&ttl=${options?.output?.ttl || 64}`
            )
            .outputOptions([
                `-reorder_queue_size ${options?.output?.jitterBuffer || "25"}`,
                `-flags low_delay`,
                `-muxdelay 0`,
                `-b:v ${options?.output?.bitrate || "5M"}`,
            ]);

        if (options?.output?.fec) {
            command.outputOptions([
                `-fec prompeg=l=${options?.output?.fec?.columns || 4}:d=${options?.output?.fec?.rows || 4}`,
            ]);
        }

        command = setCodec(command, options?.output);

        if (!options?.output?.vbr) {
            command.outputOptions([
                `-minrate ${options?.output?.bitrate || "5M"}`,
                `-maxrate ${options?.output?.bitrate || "5M"}`,
                `-bufsize 500K`,
            ]);
        } else {
            command.outputOptions([
                `-minrate ${options?.output?.vbr?.minBitrate || "5M"}`,
                `-maxrate ${options?.output?.vbr?.maxBitrate || "5M"}`,
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

        command.on("progress", (progress) => {
            logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
            jobManager.update(job?.jobId, { progress: Math.floor(progress.percent) });
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

    response.job = jobManager.get(`${options?.output?.address}:${options?.output?.port}`);
    return response;
};

module.exports = process;
