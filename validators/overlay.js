"use strict";

module.exports = (direction = "input") => {
    return {
        "overlay.line1": {
            isString: { default: "", errorMessage: "Line 1 must be a String" },
        },
        "overlay.line2": {
            isString: { default: "", errorMessage: "Line 2 must be a String" },
        },
        "overlay.fontSize": {
            isInt: { min: 10, max: 200, default: 120, errorMessage: "Font size must be between 10 and 200." },
        },
        "overlay.timecode": {
            isBoolean: { default: false, errorMessage: "Timecode must be a Boolean value." },
        },
        "overlay.offset": {
            isInt: { min: -12, max: 12, default: 0, errorMessage: "Time offset must be between -12 and +12 hours." },
        },
        // "overlay.font": {
        //     optional: true,
        //     isIn: { values: [], default: "swansea-bold.ttf", errorMessage: "Fonts must be in the fonts folder" },
        // },
    };
};

// "font": "swansea-bold.ttf",
// "offset": 1,
// "topRight": {
//     "line1": "%{pts\\:hms}",
//     "line2": "Frame %{n}"
// }
