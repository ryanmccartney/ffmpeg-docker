"use strict";

module.exports = (direction = "input") => {
    return {
        "vmaf.reference": {
            isString: {
                errorMessage: "VMAF reference file must be a string",
            },
        },
        "vmaf.model": {
            optional: true,
            isString: {
                default: "vmaf_v0.6.1.json",
                errorMessage: "VMAF model must be a string",
            },
        },
        "vmaf.threads": {
            optional: true,
            isInt: { min: 1, max: 20, default: 1, errorMessage: "VMAF threads must be a integar" },
        },
    };
};
