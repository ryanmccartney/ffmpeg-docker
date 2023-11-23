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

const winston = require("winston");
const path = require("path");
require("winston-daily-rotate-file");
const logFolder = process.env.LOG_FOLDER || "logs";
const logName = process.env.LOG_NAME || "ffmpeg";
const logLevel = process.env.LOG_LEVEL || "info";

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "blue",
        http: "magenta",
        debug: "gray",
    },
};

const customLogFormat = winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.printf((log) => `${log.timestamp} ${log.level}: ${log.message}`)
);

winston.addColors(customLevels.colors);

const loggerInstance = winston.createLogger({
    levels: customLevels.levels,
    handleExceptions: false,
    transports: [
        new winston.transports.DailyRotateFile({
            level: logLevel,
            format: customLogFormat,
            filename: path.join(logFolder, logName + "-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "100m",
            maxFiles: "1d",
        }),
        new winston.transports.Console({
            level: logLevel,
            handleExceptions: true,
            colorize: true,
            format: winston.format.combine(customLogFormat, winston.format.colorize({ all: true })),
        }),
    ],
});

const logger = (module) => {
    const filename = path.basename(module.filename);
    const loggers = {};

    for (let level in customLevels.levels) {
        loggers[level] = (message, metadata) => {
            loggerInstance[level](message, { metadata: { ...{ filename: filename }, ...metadata } });
        };
    }

    return loggers;
};

module.exports = logger;
