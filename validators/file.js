"use strict";

module.exports = (direction = "input") => {
    return {
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
