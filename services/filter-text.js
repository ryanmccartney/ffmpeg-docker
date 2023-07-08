"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");

module.exports = async (options = {}) => {
    const filters = [];
    try {
        if(options.line1){
            filters.push(
                {
                    filter: `${options?.scrolling ? "scrolltext" : "drawtext"}`,
                    options: `fontfile=\'${path.join(
                        __dirname,
                        "..",
                        "public",
                        "fonts",
                        `${options?.font || "swansea-bold.ttf"}`
                    )}:\'text=\'${
                        options?.line1
                    }\':fontcolor=${options?.textColor || "white"}:fontsize=100:box=1:boxcolor=${options?.backgroundColor || "black"}@0.5:boxborderw=8:x=(w-text_w)/2:y=((h-text_h)/2)-60`,
                }
            );
        }

        if(options.line2){
            filters.push(
                {
                    filter: `${options?.scrolling ? "scrolltext" : "drawtext"}`,
                    options: `fontfile=\'${path.join(
                        __dirname,
                        "..",
                        "public",
                        "fonts",
                        `${options?.font || "swansea-bold.ttf"}`
                    )}:\'text=\'${
                        options?.line2
                    }\':fontcolor=${options?.textColor || "white"}:fontsize=100:box=1:boxcolor=${options?.backgroundColor || "black"}@0.5:boxborderw=8:x=(w-text_w)/2:y=((h-text_h)/2)+60`,
                }
            );
        }

        if(options.timecode){
            filters.push(
                {
                    filter: `${options?.scrolling ? "scrolltext" : "drawtext"}`,
                    options: `fontfile=\'${path.join(
                        __dirname,
                        "..",
                        "public",
                        "fonts",
                        `${options?.font || "swansea-bold.ttf"}`
                    )}:\'text=\'%{pts\\:gmtime\\:${
                        Date.now() / 1000
                    }}\':fontcolor=${options?.textColor || "white"}:fontsize=100:box=1:boxcolor=${options?.backgroundColor || "black"}@0.5:boxborderw=8:x=(w-text_w)/2:y=((h-text_h)/2)+180`,
                }
            );
        }
    } catch (error) {
        logger.warn("Cannot create text filter " + error.message);
    }
    return filters

};


