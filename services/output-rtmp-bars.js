"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const getRtmpAddress = (address, key) => {
    let fullAddress = `rtmp://${address}`;
    if (key) {
        fullAddress += `/${key}`;
    }
    return fullAddress;
};

module.exports = async (options) => {
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");
    const command = ffmpeg({ logger: logger })
        .addInput("smptehdbars=rate=25:size=1920x1080")
        .inputOptions(["-re", "-f lavfi"])
        .addInput("sine=frequency=1000:sample_rate=48000")
        .inputOptions(["-f lavfi"])
        .videoCodec("libx264")
        .videoBitrate(options.bitrate)
        .videoFilters([
            {
                filter: "drawtext",
                options: `fontfile=\'${path.join(
                    __dirname,
                    "..",
                    "public",
                    "fonts",
                    `${options.font || "swansea-bold.ttf"}`
                )}:\'text=\'${
                    options.line1
                }\':fontcolor=white:fontsize=100:box=1:boxcolor=black@0.5:boxborderw=8:x=(w-text_w)/2:y=((h-text_h)/2)-60`,
            },
            {
                filter: "drawtext",
                options: `fontfile=\'${path.join(
                    __dirname,
                    "..",
                    "public",
                    "fonts",
                    `${options.font || "swansea-bold.ttf"}`
                )}:\'text=\'${
                    options.line2
                }\':fontcolor=white:fontsize=100:box=1:boxcolor=black@0.5:boxborderw=8:x=(w-text_w)/2:y=((h-text_h)/2)+60`,
            },
            {
                filter: "drawtext",
                options: `fontfile=\'${path.join(
                    __dirname,
                    "..",
                    "public",
                    "fonts",
                    `${options.font || "swansea-bold.ttf"}`
                )}:\'text=\'%{pts\\:gmtime\\:${
                    Date.now() / 1000
                }}\':fontcolor=white:fontsize=100:box=1:boxcolor=black@0.5:boxborderw=8:x=(w-text_w)/2:y=((h-text_h)/2)+180`,
            },
        ])
        .output(getRtmpAddress(options.address, options.key))
        .outputOptions(["-f flv"]);

    command.on("end", () => {
        logger.info("Finished processing");
    });

    command.on("start", (commandString) => {
        logger.debug(`Spawned FFmpeg with command: ${commandString}`);
        return { options: options, command: commandString };
    });

    command.on("stderr", function (stderrLine) {
        logger.info("Stderr output: " + stderrLine);
    });

    command.run();

    return { options: options };
};
