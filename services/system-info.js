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
const os = require("os");
const fileReadJson = require("@utils/file-read-json");
const fileRead = require("@utils/file-read");
const ffmpegCodecs = require("@utils/ffmpeg-getcodecs");
const gitCommit = require("@utils/git-commit");
const nodeVersion = require("@utils/node-version");
const osVersion = require("@utils/os-version");
const decklinkVersion = require("@utils/decklink-version");

module.exports = async () => {
    try {
        const packageJson = await fileReadJson(path.join(__dirname, "..", "package.json"));
        return {
            time: new Date(),
            platform: os.platform(),
            uptime: os.uptime(),
            decklink: await decklinkVersion(),
            os: await osVersion(),
            ffmpeg: {
                commit: await gitCommit(path.resolve("/", "ffmpeg_sources", "ffmpeg")),
                version: await fileRead(path.resolve("/", "ffmpeg_sources", "ffmpeg", "RELEASE")),
                codecs: await ffmpegCodecs(),
            },
            package: {
                commit: await gitCommit(path.resolve("/", "home", "node", "app")),
                version: packageJson?.version,
                name: packageJson?.name,
                author: packageJson?.author,
                description: packageJson?.description,
                license: packageJson?.license,
                node: await nodeVersion(),
            },
        };
    } catch (error) {
        return { error: error.toString() };
    }
};
