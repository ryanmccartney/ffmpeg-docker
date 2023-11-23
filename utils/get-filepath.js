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
const { format } = require("date-fns");
const getFileExtension = require("@utils/get-extension");

const defaultOptions = {
    format: "h264",
    includePath: true,
    format: "h264",
    timestamp: "MM-dd-yyyy-HH-mm",
    chunks: false,
};

module.exports = async (options = {}) => {
    options = { ...defaultOptions, ...options };

    let filePath = "";
    let mediaPath = "";

    if (options?.includePath) {
        mediaPath = process.env.MEDIA_PATH || path.join(__dirname, "..", "data", "media");
    }

    if (options?.chunks && options?.timestamp) {
        const dateTimeString = format(new Date(), options?.timestamp);
        filePath = path.join(mediaPath, `${options?.file}-${dateTimeString}-%03d${getFileExtension(options?.format)}`);
    } else if (options?.chunks) {
        filePath = path.join(mediaPath, `${options?.file}-%03d${getFileExtension(options?.format)}`);
    } else if (options?.timestamp) {
        const dateTimeString = format(new Date(), options?.timestamp);
        filePath = path.join(mediaPath, `${options?.file}-${dateTimeString}${getFileExtension(options?.format)}`);
    } else {
        filePath = path.join(mediaPath, `${options?.file}${getFileExtension(options?.format)}`);
    }

    return filePath;
};
