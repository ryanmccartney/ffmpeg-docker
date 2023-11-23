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

module.exports = [
    {
        rawFormat: "auto",
        description:
            "This is the default which means 8-bit YUV 422 or 8-bit ARGB if format autodetection is used, 8-bit YUV 422 otherwise.",
    },
    {
        rawFormat: "uyvy422",
        description: "8-bit YUV 422",
    },
    {
        rawFormat: "yuv422p10",
        description: "10-bit YUV 422",
    },
    {
        rawFormat: "argb",
        description: "8-bit RGB",
    },
    {
        rawFormat: "bgra",
        description: "8-bit RGB",
    },
    {
        rawFormat: "rgb10",
        description: "10-bit RGB",
    },
];
