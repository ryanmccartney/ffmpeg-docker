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

const encodePresets = require("@utils/encodePresets");

module.exports = (direction = "input") => {
    return {
        [`${direction}.cardName`]: {
            exists: {
                errorMessage: "Decklink card name required",
            },
            isString: { errorMessage: "Decklink card name must be a string" },
        },
        [`${direction}.volume`]: {
            optional: true,
            isFloat: { min: 0, max: 1, default: 0.25, errorMessage: "Volume must be a float between 0 and 1" },
        },
        [`${direction}.duplexMode`]: {
            optional: true,
            isIn: {
                options: [["full", "half"]],
                default: "unset",
                errorMessage: "Decklink card name must one of 'full', 'half' or 'unset'",
            },
        },
        [`${direction}.encodePreset`]: {
            optional: true,
            isIn: {
                options: [encodePresets],
                default: encodePresets[0],
                errorMessage: `Encode preset must be one of ${encodePresets.toString()}.`,
            },
        },
    };
};
