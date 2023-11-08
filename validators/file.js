"use strict";

module.exports = (direction = "input") => {
    const validator = {
        [`${direction}.file`]: {
            isString: { errorMessage: "Filename must be a string." },
        },
        [`${direction}.repeat`]: {
            optional: true,
            isBoolean: { default: false, errorMessage: "Repear must be a boolean value." },
        },
        [`${direction}.chunkSize`]: {
            optional: true,
            isInt: { min: 5, max: 1800, errorMessage: "Chunks must be between 5 and 1800 seconds." },
        },
    };

    if (direction === "output") {
        validator[`${direction}.file`] = {
            optional: true,
        };
    } else {
        validator[`${direction}.file`] = {
            exists: { errorMessage: "Input filename required." },
        };
    }

    return validator;
};
