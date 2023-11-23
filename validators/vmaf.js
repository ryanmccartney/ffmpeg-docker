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

module.exports = (direction = "input") => {
    return {
        "vmaf.reference": {
            isString: {
                errorMessage: "VMAF reference file must be a string",
            },
        },
        "vmaf.model": {
            optional: true,
            isString: {
                default: "vmaf_v0.6.1.json",
                errorMessage: "VMAF model must be a string",
            },
        },
        "vmaf.threads": {
            optional: true,
            isInt: { min: 1, max: 20, default: 1, errorMessage: "VMAF threads must be a integar" },
        },
    };
};
