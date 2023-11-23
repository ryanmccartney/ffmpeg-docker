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
const sharp = require("sharp");
const path = require("path");
const thumbnailCache = require("@utils/thumbnail-cache");

module.exports = async (jobId, resize = 0.2) => {
    try {
        const resizedThumbnail = await sharp(path.join(__dirname, "..", "data", "thumbnail", `${jobId}.png`))
            .resize(parseInt(1920 * resize), parseInt(1080 * resize))
            .png()
            .toBuffer();

        await thumbnailCache.set(jobId, resizedThumbnail);

        return `data:image/png;base64,${resizedThumbnail.toString("base64")}`;
    } catch (error) {
        let fallbackThumbnail = await thumbnailCache.get(jobId);

        if (!fallbackThumbnail) {
            fallbackThumbnail = await sharp({
                create: {
                    width: 48,
                    height: 48,
                    channels: 3,
                    background: { r: 0, g: 0, b: 0 },
                },
            })
                .resize(parseInt(1920 * resize), parseInt(1080 * resize))
                .png()
                .toBuffer();
        }

        return `data:image/png;base64,${fallbackThumbnail.toString("base64")}`;
    }
};
