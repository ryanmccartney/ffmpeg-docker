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
const fileDelete = require("@utils/file-delete");

const process = async (options) => {
    const response = { options: options };
    let repeat = "-stream_loop 0";
    if (options?.input?.repeat) {
        repeat = `-stream_loop -1`;
    }

    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    const audioFilePath = path.join(__dirname, "..", "data", "media", options?.input?.file);

    try {
        let job = jobManager.start(
            options?.output?.file || options?.input?.file,
            `File to ${options?.output?.file}.m3u8`,
            ["audio", "file", "hls"]
        );

        const filters = await filterCombine(await filterText({ ...options, ...job }));
        let command = ffmpeg({ logger: logger })
            .input(audioFilePath)
            .inputOptions([`-re`, repeat])
            .addInput(`${options?.input?.type || "smptehdbars"}=rate=25:size=1920x1080`)
            .inputOptions(["-re", "-f lavfi"])
            .outputOptions("-ar 48000")
            .outputOptions("-shortest")
            .output(`${path.join(__dirname, "..", "data", "hls", options?.output?.file || job.jobId)}.m3u8`)
            .outputOptions([
                "-g 30",
                "-c:a aac",
                "-strict experimental",
                "-movflags faststart",
                "-f hls",
                `-hls_time ${options?.output?.chunkDuration || 0.5}`,
                `-hls_list_size ${options?.output?.chunks || 5}`,
                "-hls_flags independent_segments",
            ]);

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
            logger.info("Finished encoding bars to HLS");
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

        command.on("stderr", (stderrLine) => {
            logger.info("ffmpeg: " + stderrLine);

            //If new TS file writing
            if (stderrLine.includes(`.ts' for writing`)) {
                job = jobManager.update(job?.jobId, { chunks: (job.chunks || 0) + 1 });
                const totalChunks = options?.output?.chunks || 5;

                if (job.chunks > totalChunks + 1) {
                    fileDelete(`data/hls/${options?.output?.file || job.jobId}${job.chunks - 7}.ts`);
                }
            }
        });

        command.on("error", (error) => {
            logger.error(error);
            jobManager.end(job?.jobId, false);
        });

        command.run();
    } catch (error) {
        logger.error(error.message);
        response.errors = [error];
    }

    response.job = jobManager.get(options?.output?.file || options?.input?.file);
    return response;
};

module.exports = process;
