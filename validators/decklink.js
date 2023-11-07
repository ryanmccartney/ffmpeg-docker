"use strict";

const encodePresets = require("@utils/encodePresets");

module.exports = (direction = "input") => {
    return {
        "output.cardName": {
            exists: {
                errorMessage: "Decklink card name required",
            },
            isString: { errorMessage: "Decklink card name must be a string" },
        },
        "output.volume": {
            optional: true,
            isFloat: { min: 0, max: 1, default: 0.25, errorMessage: "Volume must be a float between 0 and 1" },
        },
        "output.duplexMode": {
            optional: true,
            isIn: {
                options: [["full", "half"]],
                default: "unset",
                errorMessage: "Decklink card name must one of 'full', 'half' or 'unset'",
            },
        },
        "output.encodePreset": {
            optional: true,
            isIn: {
                options: [encodePresets],
                default: encodePresets[0],
                errorMessage: `Encode preset must be one of ${encodePresets.toString()}.`,
            },
        },
    };
};
