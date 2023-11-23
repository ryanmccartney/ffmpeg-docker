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
const jobManager = require("@utils/jobManager");
const filterCombine = require("@utils/filter-combine");
const filterText = require("@utils/filter-text");
const filterImage = require("@utils/filter-image");
const getRtmpAddress = require("@utils/rtmp-address");
const setCodec = require("@utils/set-codec");

const process = async (options) => {
    const response = { options: options };
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    try {
        const rtmpAddress = getRtmpAddress(options?.output?.address, options?.output?.path, options?.output?.key);

        const job = jobManager.start(`${options?.input?.cardName}-in`, `Decklink to RTMP ${rtmpAddress}`, [
            "encode",
            "rtmp",
            "decklink",
        ]);

        const filters = await filterCombine(await filterText({ ...options, ...job }));

        let command = ffmpeg({ logger: logger })
            .input(options?.input?.cardName)
            .inputFormat("decklink")
            .inputOptions(["-protocol_whitelist", "srt,udp,rtp", "-stats", "-re"])
            .output(rtmpAddress)
            .outputOptions(["-f flv"])
            .outputOptions(`-b:v ${options?.output?.bitrate || "5M"}`);

        command = setCodec(command, options?.output);

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
            logger.info("Finished encoding decklink card to RTMP");
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
