"use strict";

const logger = require("@utils/logger")(module);
const getFilepath = require("@utils/get-filepath");

module.exports = async (command, options) => {
    try {
        if (options.overlay.image && options.overlay.image.file) {
            const filepath = await getFilepath({
                file: options.overlay.image.file,
                timestamp: false,
                format: options.overlay.image.format || "png",
            });

            //ffmpeg -y -i video.mp4 -i overlay.png -filter_complex [0]overlay=x=0:y=0[out] -map [out] -map 0:a? test.mp4

            // command.input(filepath);
            // command.complexFilter(
            //     [
            //         {
            //             filter: "overlay",
            //             options: { x: 0, y: 0 },
            //             inputs: ["0:v"],
            //             outputs: "output",
            //         },
            //     ],
            //     "output"
            // );
        }
    } catch (error) {
        logger.warn("Cannot create image overlay filter");
        logger.warn(error);
    }
    return command;
};
