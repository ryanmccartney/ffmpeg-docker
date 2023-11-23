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
const util = require("util");
const path = require("path");
const QRCode = require("qrcode");
const parse = require("@utils/parse");

module.exports = async (qr) => {
    const response = { status: true, data: {} };
    try {
        const QrType = qr?.type || "png";
        const qrCodePath = path.join(__dirname, "..", "data", "qr", qr?.file + "." + QrType);

        response.data = await QRCode.toFile(qrCodePath, await parse(qr?.text, qr), {
            type: QrType,
            color: {
                dark: `${qr.color || "#FFF"}`,
                light: `${qr.background || "#000"}`,
            },
        });
    } catch (error) {
        logger.warn(error);
        response.status = false;
        response.error = error;
    }
};
