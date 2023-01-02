"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

module.exports = async (option) => {
    ffmpeg.setFfmpegPath("/root/bin/ffmpeg");
    const command = ffmpeg({ logger: logger })
        .input(path.join(__dirname, "..", "data", "media", option?.filename))
        .inputOptions(["-re"])
        .videoCodec("libx264")
        .videoBitrate(option?.bitrate)
        .videoFilters([
            {
                filter: "drawtext",
                options: `text='${option?.line1}':fontcolor=white:fontsize=100:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=(h-text_h)/2-60`,
            },
        ])
        .videoFilters([
            {
                filter: "drawtext",
                options: `text='${option?.line2}':fontcolor=white:fontsize=100:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=(h-text_h)/2+60`,
            },
        ])
        .output(`srt://${option?.address}:${option?.port}?pkt_size=1316`)
        .outputOptions(["-preset veryfast", "-f mpegts"]);

    command.on("end", function () {
        logger.info("Finished processing");
    });

    command.on("start", function (commandLine) {
        logger.debug("Spawned FFMPEG with command: " + commandLine);
    });

    command.run();

    return { test: "test" };
};
