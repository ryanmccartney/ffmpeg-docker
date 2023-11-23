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
const qr = require("@utils/qr");
const imageFilter = require("@utils/filter-image");

module.exports = async (command, options) => {
    try {
        if (options.overlay.qr && options.overlay.qr.data) {
            const data = await qr(options.overlay.qr);

            options.overlay.image.file = path.join(__dirname, "..", "data", "qr", qrData?.file);
            options.overlay.image.format = options.overlay.qr?.type || "png";
            options.overlay.image.size = options.overlay.qr?.size || 20;
            options.overlay.image.location = {
                x: options?.overlay?.qr?.location?.x || 0,
                y: options?.overlay?.qr?.location?.y || 0,
            };

            command = imageFilter(command, options);
        }
    } catch (error) {
        logger.warn("Cannot create QR code filter ");
        logger.warn(error);
    }
    return command;
};
