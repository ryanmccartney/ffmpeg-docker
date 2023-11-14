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
        [`${direction}.path`]: {
            optional: true,
            isString: { default: "", errorMessage: "Path must be a valid string" },
        },
        [`${direction}.port`]: {
            optional: true,
            exists: { errorMessage: "Must provide a port number as an integar" },
            isInt: {
                min: 1024,
                max: 65535,
                default: 1935,
                errorMessage: "Must be a valid port number between 1024 to 65535",
            },
        },
        [`${direction}.key`]: {
            optional: true,
            isString: {
                default: "",
                errorMessage: "RTMP key must be a string.",
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
