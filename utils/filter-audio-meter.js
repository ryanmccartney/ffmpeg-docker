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
const path = require("path");

module.exports = async (options = {}) => {
    let filters = [];
    try {
        if (options.audioMeter) {
            filters = [
                {
                    filter: "amovie",
                    options: "1:d=0",
                    outputs: "volume",
                },
                {
                    filter: "showvolume",
                    inputs: "volume",
                    outputs: "volume_info",
                },
                {
                    filter: "drawtext",
                    options:
                        "text='Volume: %{metadata=lavfi.showvolume.volume': x=(w-tw-10): y=(h-th-10): fontcolor=white: fontsize=24: box=1: boxcolor=black'",
                    inputs: "volume_info",
                    outputs: "output",
                },
            ];
        }
    } catch (error) {
        logger.warn("Cannot create text filter " + error.message);
    }
    return filters;
};
