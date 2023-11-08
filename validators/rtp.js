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
        [`${direction}.packetSize`]: {
            optional: true,
            isInt: {
                min: 0,
                max: 65535,
                default: 1316,
                errorMessage: "RTP Packet size must be between 0 and 65535 bytes",
            },
        },
        [`${direction}.buffer`]: {
            optional: true,
            isInt: { min: 0, max: 255, default: 65535, errorMessage: "RTP buffer must be between 0 and 65535 bytes" },
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
