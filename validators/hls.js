"use strict";

const encodePresets = require("@utils/encodePresets");

module.exports = (direction = "input") => {
    return {
        [`${direction}.file`]: {
            optional: true,
            isString: { errorMessage: "HLS filename must be a string" },
        },
        [`${direction}.chunkDuration`]: {
            optional: true,
            isFloat: {
                min: 0,
                max: 10,
                default: 0.5,
                errorMessage: "Chunk duration must be a float between 0 and 10 seconds",
            },
        },
        [`${direction}.chunks`]: {
            optional: true,
            isInt: {
                min: 1,
                max: 50,
                default: 5,
                errorMessage: "Number of chunks must be an integar between 1 and 50",
            },
        },
        [`${direction}.encodePreset`]: {
            optional: true,
            isIn: {
                options: [encodePresets],
                default: encodePresets[0],
                errorMessage: `Encode preset must be one of ${encodePresets.toString()}.`,
            },
        },
    };
};
