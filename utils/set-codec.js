"use strict";

module.exports = (command, options = { format: "h264" }) => {
    if (options.format === "prores") {
        command.videoCodec("prores_ks").outputOptions("-profile:v", "3").outputOptions("-c:a", "pcm_s16le");
    }

    if (options.format === "h264") {
        command
            .videoCodec("libx264")
            .outputOptions("-crf", "23")
            .outputOptions("-preset", "ultrafast")
            .outputOptions("-pass", "1")
            .outputOptions("-profile:v", "baseline")
            .outputOptions("-max_interleave_delta", "500")
            .outputOptions("-max_delay", "100");
    }

    if (options.format === "mjpeg") {
        command
            .videoCodec("mjpeg")
            .outputOptions("-q:v", "10")
            .outputOptions("-c:a", "copy")
            .addOutputOptions("-pix_fmt", "yuvj422p");
    }

    if (options.format === "mjpeg2") {
        command.videoCodec("mpeg2video").addOutputOptions("-pix_fmt", "yuv420p");
    }

    if (!options.format) {
        command
            .videoCodec("libx264")
            .videoCodec("libx264")
            .outputOptions("-crf", "23")
            .outputOptions("-preset", "ultrafast");
    }

    return command;
};
