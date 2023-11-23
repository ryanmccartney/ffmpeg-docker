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

const defaultOutput = { audioCodec: "aac", videoCodec: "h264", encodePreset: "ultrafast" };

module.exports = (command, output = {}) => {
    output = { ...defaultOutput, ...output };

    if (output?.videoCodec === "prores") {
        command.videoCodec("prores_ks").outputOptions("-profile:v", "3").outputOptions("-c:a", "pcm_s16le");
    }

    if (output?.videoCodec === "h264") {
        command
            .videoCodec("libx264")
            .outputOptions("-preset", output?.encodePreset || "ultrafast")
            .outputOptions("-pass", "1")
            .outputOptions("-tune zerolatency")
            .outputOptions("-max_delay", "100");
    }

    if (output?.videoCodec === "mjpeg") {
        command
            .videoCodec("mjpeg")
            .outputOptions("-q:v", "10")
            .outputOptions("-c:a", "copy")
            .addOutputOptions("-pix_fmt", "yuvj422p");
    }

    if (output?.videoCodec === "mjpeg2") {
        command.videoCodec("mpeg2video").addOutputOptions("-pix_fmt", "yuv420p");
    }

    if (!output?.videoCodec) {
        command
            .videoCodec("libx264")
            .videoCodec("libx264")
            .outputOptions("-crf", "23")
            .outputOptions("-preset", output?.encodePreset || "ultrafast");
    }

    if (output?.audioCodec === "aac") {
        command.audioCodec("aac");
    }

    if (output?.audioCodec === "mp3") {
        command.audioCodec("mp3");
    }

    if (!output?.audioCodec) {
        command.audioCodec("mp3");
    }

    return command;
};
