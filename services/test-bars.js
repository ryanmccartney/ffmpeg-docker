"use strict";

const logger = require("@utils/logger")(module);
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

module.exports = async () => {
    const command = ffmpeg({ logger: logger })
        .addInput("smptehdbars=rate=25:size=1920x1080")
        .inputOptions(["-f lavfi", "-re"])
        .addInput("sine=frequency=1000:sample_rate=48000")
        .fps(25)
        .output(path.join(__dirname, "..", "data", "media", "test.mp4"))
        .on("end", function () {
            console.log("Finished processing");
        })
        .run();

    return { test: "test" };
};
