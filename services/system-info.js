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
