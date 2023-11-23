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

const logger = require("@utils/logger")(module);
const os = require("os");

module.exports = async (options) => {
    if (os.arch() === "x64" && os.platform() === "linux") {
        const macadam = require("macadam");
        let status;
        try {
            status = await macadam.setDeviceConfig({
                deviceIndex: parseInt(options?.cardIndex || 0),
                duplexMode: macadam.bmdDuplexModeFull,
            });
        } catch (error) {
            status = false;
            logger.warn(error);
        }
        return status;
    } else {
        logger.error(`Invalid Architecture - this command is not supported on ${os.arch()}`);
        return {
            error: "Invalid Architecture - this command is not supported on your system architecture",
            arch: os.arch(),
        };
    }
};
