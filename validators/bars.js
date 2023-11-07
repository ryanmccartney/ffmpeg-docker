"use strict";

const barsType = require("@utils/barsTypes");

module.exports = (direction = "input") => {
    return {
        [`${direction}.type`]: {
            optional: true,
            isIn: {
                options: [barsType],
                default: barsType[0],
                errorMessage: `Bars type must be one of ${barsType.toString()}`,
            },
        },
        [`${direction}.frequency`]: {
            optional: true,
            isInt: {
                min: 100,
                max: 18000,
                default: 1000,
                errorMessage: "Audio frequency must be between 100Hz and 18,000 Hz",
            },
        },
        [`${direction}.duration`]: {
            optional: true,
            isInt: {
                min: 1,
                max: 3600,
                default: 10,
                errorMessage: "Duration of bars must be between 1 and 3,600 seconds as an integar",
            },
        },
    };
};
