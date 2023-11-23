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

const encodePresets = require("@utils/encodePresets");
const isIPorFQDN = require("@utils/validator-isiporfqdn");

module.exports = (direction = "input") => {
    return {
        [`${direction}.address`]: {
            exists: { errorMessage: "Must provide and address required." },
            custom: {
                options: isIPorFQDN,
                errorMessage: "Address must be a valid IP Address or FQDN",
            },
        },
        [`${direction}.port`]: {
            exists: { errorMessage: "Must provide a port number as an integar" },
            isInt: { min: 1024, max: 65535, errorMessage: "Must be a valid port number between 1024 to 65535" },
        },
        [`${direction}.latency`]: {
            optional: true,
            isInt: { min: 20, max: 10000, default: 250, errorMessage: "SRT Latency must be between 20ms and 10000ms" },
        },
        [`${direction}.packetSize`]: {
            optional: true,
            isInt: {
                min: 0,
                max: 65535,
                default: 1316,
                errorMessage: "SRT Packet size must be between 0 and 65535 bytes",
            },
        },
        [`${direction}.ttl`]: {
            optional: true,
            isInt: {
                min: 0,
                max: 255,
                default: 64,
                errorMessage: "Time to Live of SRT Packets must be between 0 and 255",
            },
        },
        [`${direction}.tos`]: {
            optional: true,
            isInt: { min: 0, max: 255, default: 104, errorMessage: "ToS of SRT Packets must be between 0 and 255" },
        },
        [`${direction}.mode`]: {
            optional: true,
            isIn: {
                options: [["listener", "caller"]],
                default: "caller",
                errorMessage: "SRT mode must be 'Caller' or 'Listener'",
            },
        },
        [`${direction}.bitrate`]: {
            optional: true,
            isString: {
                default: "5000k",
                errorMessage: "Bitrate must be a string.",
            },
        },
        [`${direction}.encodePreset`]: {
            optional: true,
            isIn: {
                options: [encodePresets],
                default: encodePresets[0],
                errorMessage: `Encode preset must be one of ${encodePresets.toString()}.`,
            },
        },
    };
};
