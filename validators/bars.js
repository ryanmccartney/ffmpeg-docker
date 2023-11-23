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

const barsType = require("@utils/barsTypes");

module.exports = (direction = "input") => {
    return {
        [`${direction}.type`]: {
            optional: true,
            isIn: {
                options: [barsType],
                default: barsType[0],
                errorMessage: `Bars type must be one of ${barsType.toString()}`,
            },
        },
        [`${direction}.frequency`]: {
            optional: true,
            isInt: {
                min: 100,
                max: 18000,
                default: 1000,
                errorMessage: "Audio frequency must be between 100Hz and 18,000 Hz",
            },
        },
        [`${direction}.duration`]: {
            optional: true,
            isInt: {
                min: 1,
                max: 3600,
                default: 10,
                errorMessage: "Duration of bars must be between 1 and 3,600 seconds as an integar",
            },
        },
    };
};
