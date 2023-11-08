"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const { format } = require("date-fns");
const getFileExtension = require("@utils/get-extension");

const defaultOptions = {
    format: "h264",
    includePath: true,
    format: "h264",
    timestamp: "MM-dd-yyyy-HH-mm",
    chunks: false,
};

module.exports = async (options = {}) => {
    options = { ...defaultOptions, ...options };

    let filePath = "";
    let mediaPath = "";

    if (options?.includePath) {
        mediaPath = process.env.MEDIA_PATH || path.join(__dirname, "..", "data", "media");
    }

    if (options?.chunks && options?.timestamp) {
        const dateTimeString = format(new Date(), options?.timestamp);
        filePath = path.join(mediaPath, `${options?.file}-${dateTimeString}-%03d${getFileExtension(options?.format)}`);
    } else if (options?.chunks) {
        filePath = path.join(mediaPath, `${options?.file}-%03d${getFileExtension(options?.format)}`);
    } else if (options?.timestamp) {
        const dateTimeString = format(new Date(), options?.timestamp);
        filePath = path.join(mediaPath, `${options?.file}-${dateTimeString}${getFileExtension(options?.format)}`);
    } else {
        filePath = path.join(mediaPath, `${options?.file}${getFileExtension(options?.format)}`);
    }

    return filePath;
};
