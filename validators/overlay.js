"use strict";

module.exports = (direction = "input") => {
    return {
        "overlay.line1": {
            optional: true,
            isString: { default: "", errorMessage: "Line 1 must be a String" },
        },
        "overlay.line2": {
            optional: true,
            isString: { default: "", errorMessage: "Line 2 must be a String" },
        },
        "overlay.fontSize": {
            optional: true,
            isInt: { min: 10, max: 200, default: 120, errorMessage: "Font size must be between 10 and 200" },
        },
        "overlay.timecode": {
            optional: true,
            isBoolean: { default: false, errorMessage: "Timecode must be a Boolean value" },
        },
        "overlay.offset": {
            optional: true,
            isInt: { min: -12, max: 12, default: 0, errorMessage: "Time offset must be between -12 and +12 hours" },
        },
        "overlay.font": {
            optional: true,
            isString: { default: "swansea-bold.ttf", errorMessage: "Fonts must be in the fonts folder" },
        },
        "overlay.scrolling": {
            optional: true,
            isBoolean: { default: false, errorMessage: "Scrolling must be a boolean type" },
        },
        "overlay.image.file": {
            optional: true,
            isString: { default: "", errorMessage: "Image file must be a string" },
        },
        "overlay.image.size": {
            optional: true,
            isInt: {
                min: 0,
                max: 100,
                default: 50,
                errorMessage: "Size between 0 and 100, relative to view height",
            },
        },
        "overlay.image.location.x": {
            optional: true,
            isInt: { min: -100, max: 100, default: 0, errorMessage: "X-axis location between -100 and 100" },
        },
        "overlay.image.location.y": {
            optional: true,
            isInt: { min: -100, max: 100, default: 0, errorMessage: "Y-axis location between -100 and 100" },
        },
    };
};

// "topRight": {
//     "line1": "%{pts\\:hms}",
//     "line2": "Frame %{n}"
// }
