"use strict";

module.exports = (format = "h264") => {
    if (format === "prores") {
        return ".mov";
    }

    if (format === "h264") {
        return ".mp4";
    }

    if (format === "mjpeg") {
        return ".mov";
    }

    return ".mov";
};
