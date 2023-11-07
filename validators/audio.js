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
        [`${direction}.file`]: {
            exists: {
                errorMessage: "Input filename required.",
            },
            isString: { errorMessage: "Filename must be a string." },
        },
        [`${direction}.repeat`]: {
            optional: true,
            isBoolean: { default: false, errorMessage: "Repear must be a boolean value." },
        },
    };
};
