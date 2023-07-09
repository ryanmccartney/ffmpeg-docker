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

        if(options.topRight){
            if(options.topRight.line1){
                filters.push(
                    {
                        filter: "drawtext",
                        options: `fontfile=\'${path.join(
                            __dirname,
                            "..",
                            "public",
                            "fonts",
                            `${options?.font || "swansea-bold.ttf"}`
                        )}:\'text=\'${
                            options.topRight.line1
                        }\':fontcolor=${options?.textColor || "white"}:fontsize=50:box=1:boxcolor=${options?.backgroundColor || "black"}@0.5:boxborderw=8:x=(w-text_w-40):y=60`,
                    }
                );
            }
            if(options.topRight.line2){
                filters.push(
                    {
                        filter: "drawtext",
                        options: `fontfile=\'${path.join(
                            __dirname,
                            "..",
                            "public",
                            "fonts",
                            `${options?.font || "swansea-bold.ttf"}`
                        )}:\'text=\'${
                            options.topRight.line2
                        }\':fontcolor=${options?.textColor || "white"}:fontsize=50:box=1:boxcolor=${options?.backgroundColor || "black"}@0.5:boxborderw=8:x=(w-text_w-40):y=120`,
                    }
                );
            }
        }
        if(options.timecode){
            let offset = 0;

            if(options.offset){
                offset = 60*60*parseInt(options.offset)
            }

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
                        (Date.now() / 1000) + offset
                    }}\':fontcolor=${options?.textColor || "white"}:fontsize=100:box=1:boxcolor=${options?.backgroundColor || "black"}@0.5:boxborderw=8:x=(w-text_w)/2:y=((h-text_h)/2)+180`,
                }
            );
        }
    } catch (error) {
        logger.warn("Cannot create text filter " + error.message);
    }
    return filters
};