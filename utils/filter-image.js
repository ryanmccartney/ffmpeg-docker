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
const getFilepath = require("@utils/get-filepath");

module.exports = async (command, options) => {
    try {
        if (options.overlay.image && options.overlay.image.file) {
            const filepath = await getFilepath({
                file: options.overlay.image.file,
                timestamp: false,
                format: options.overlay.image.format || "png",
            });

            //ffmpeg -y -i video.mp4 -i overlay.png -filter_complex [0]overlay=x=0:y=0[out] -map [out] -map 0:a? test.mp4

            // command.input(filepath);
            // command.complexFilter(
            //     [
            //         {
            //             filter: "overlay",
            //             options: { x: 0, y: 0 },
            //             inputs: ["0:v"],
            //             outputs: "output",
            //         },
            //     ],
            //     "output"
            // );
        }
    } catch (error) {
        logger.warn("Cannot create image overlay filter");
        logger.warn(error);
    }
    return command;
};
