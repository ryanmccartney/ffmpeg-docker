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
const fs = require("fs");
const util = require("util");

const readdir = util.promisify(fs.readdir);

module.exports = async (options) => {
    try {
        const directoryPath = path.join(process.cwd(), "data", "media");
        const files = await readdir(directoryPath, { withFileTypes: options?.extensions || true });
        const filesDetail = [];

        for (let file of files) {
            if (file.name !== ".gitkeep") {
                const stat = await fs.promises.stat(path.join(directoryPath, file.name));
                filesDetail.push({
                    name: file.name,
                    size: stat.size,
                    ctime: stat.ctime,
                });
            }
        }

        return { files: filesDetail };
    } catch (error) {
        logger.warn(`Cannot list files ${error.message}`);
        return { errors: [error] };
    }
};
