"use strict";

const defaultOutput = { format: "h264", encodePreset: "ultrafast" };

module.exports = (command, output = {}) => {
    output = { ...defaultOutput, ...output };

    if (output?.format === "prores") {
        command.videoCodec("prores_ks").outputOptions("-profile:v", "3").outputOptions("-c:a", "pcm_s16le");
    }

    if (output?.format === "h264") {
        command
            .videoCodec("libx264")
            .outputOptions("-crf", "23")
            .outputOptions("-preset", output?.encodePreset || "ultrafast")
            .outputOptions("-pass", "1")
            .outputOptions("-profile:v", "baseline")
            .outputOptions("-tune zerolatency")
            .outputOptions("-max_interleave_delta", "500")
            .outputOptions("-max_delay", "100");
    }

    if (output?.format === "mjpeg") {
        command
            .videoCodec("mjpeg")
            .outputOptions("-q:v", "10")
            .outputOptions("-c:a", "copy")
            .addOutputOptions("-pix_fmt", "yuvj422p");
    }

    if (output?.format === "mjpeg2") {
        command.videoCodec("mpeg2video").addOutputOptions("-pix_fmt", "yuv420p");
    }

    if (!output?.format) {
        command
            .videoCodec("libx264")
            .videoCodec("libx264")
            .outputOptions("-crf", "23")
            .outputOptions("-preset", output?.encodePreset || "ultrafast");
    }

    return command;
};
