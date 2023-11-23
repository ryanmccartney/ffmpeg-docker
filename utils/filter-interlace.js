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
const parse = require("@utils/parse");

module.exports = async (interlace = false, fieldorder = "tff") => {
    const filters = [];
    try {
        if (interlace) {
            filters.push({
                filter: `yadif`,
                //  options: { mode: 1, parity: "t", deint: 0 },
            });
        }
    } catch (error) {
        logger.warn("Cannot create interalcing filter " + error.message);
    }
    return filters;
};
