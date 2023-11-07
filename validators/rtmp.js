"use strict";

const encodePresets = require("@utils/encodePresets");

module.exports = {
    "output.address": {
        exists: { errorMessage: "Must provide and address required." },
    },
    "output.port": {
        optional: true,
        exists: { errorMessage: "Must provide a port number as an integar" },
        isInt: {
            min: 1024,
            max: 65535,
            default: 1935,
            errorMessage: "Must be a valid port number between 1024 to 65535",
        },
    },
    "output.key": {
        optional: true,
        isString: {
            default: "",
            errorMessage: "RTMP key must be a string.",
        },
    },
    "output.ttl": {
        optional: true,
        isInt: { min: 0, max: 255, default: 64, errorMessage: "Time to Live of SRT Packets must be between 0 and 255" },
    },
    "output.tos": {
        optional: true,
        isInt: { min: 0, max: 255, default: 104, errorMessage: "ToS of SRT Packets must be between 0 and 255" },
    },
    "output.bitrate": {
        optional: true,
        isString: {
            default: "5000k",
            errorMessage: "Bitrate must be a string.",
        },
    },
    "output.encodePreset": {
        optional: true,
        isIn: {
            values: encodePresets,
            default: encodePresets[0],
            errorMessage: `Encode preset must be one of ${encodePresets.toString()}.`,
        },
    },
};
