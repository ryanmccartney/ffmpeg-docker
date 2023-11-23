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

let command;

//ffmpeg -ss 00:00:10 -i input.mp4 -vf "select='eq(n,0)',setpts=N/FRAME_RATE/TB" -r 25 -f decklink 'Decklink Output'

module.exports = async (cardIndex, options) => {
    let status = true;
    let repeat = "";
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");

    const filters = await filterCombine(await filterText({ ...options, ...job }));

    if (options?.input?.repeat) {
        repeat = "-stream_loop -1";
    }

    if (command) {
        logger.info("Killing already running FFmpeg process");
        await command.kill();
    }
    command = ffmpeg({ logger: logger })
        .input(`${path.join(__dirname, "..", "data", "media", options.file)}`)
        .seekInput(options.timestamp)
        .complexFilter([
            {
                filter: "split",
                options: "2",
                outputs: ["selected", "dummy"],
            },
            {
                filter: "trim",
                options: "start_frame=0:end_frame=0",
                inputs: "selected",
                outputs: "output",
            },
            {
                filter: "setpts",
                options: "PTS-STARTPTS",
                inputs: "output",
            },
        ])
        // .inputOptions([`-re`,repeat])
        // .outputOptions(["-pix_fmt uyvy422","-s 1920x1080","-ac 2","-f decklink"])
        .output(options.cardName)
        .outputOptions(["-r 25", "-f decklink", "-format_code 8", "-pix_fmt uyvy422"]);
    //.outputOptions(["-pix_fmt uyvy422","-s 1920x1080","-ac 2","-f decklink"]);

    if (Array.isArray(filters)) {
        command.videoFilters(filters);
    }

    command.on("end", () => {
        logger.info("Finished playing file");
    });

    command.on("error", () => {
        logger.info("FFmpeg process killed");
    });

    command.on("start", (commandString) => {
        logger.debug(`Spawned FFmpeg with command: ${commandString}`);
        return { options: options, command: commandString };
    });

    command.on("progress", (progress) => {
        logger.info("ffmpeg-progress: " + Math.floor(progress.percent) + "% done");
    });

    command.on("stderr", (stderrLine) => {
        logger.info("ffmpeg: " + stderrLine);
    });

    try {
        command.run();
    } catch (error) {
        logger.warn(error);
        status = "false";
    }

    return { error: status, options: options };
};
