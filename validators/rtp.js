"use strict";

const encodePresets = require("@utils/encodePresets");

module.exports = (direction = "input") => {
    return {
        "output.address": {
            exists: { errorMessage: "Must provide and address required." },
            isIP: { errorMessage: "Address must be a valid IP Address." },
        },
        "output.port": {
            exists: { errorMessage: "Must provide a port number as an integar" },
            isInt: { min: 1024, max: 65535, errorMessage: "Must be a valid port number between 1024 to 65535" },
        },
        "output.packetSize": {
            optional: true,
            isInt: {
                min: 0,
                max: 65535,
                default: 1316,
                errorMessage: "RTP Packet size must be between 0 and 65535 bytes",
            },
        },
        "output.buffer": {
            optional: true,
            isInt: { min: 0, max: 255, default: 65535, errorMessage: "RTP buffer must be between 0 and 65535 bytes" },
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
                options: [encodePresets],
                default: encodePresets[0],
                errorMessage: `Encode preset must be one of ${encodePresets.toString()}.`,
            },
        },
    };
};
