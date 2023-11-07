"use strict";

module.exports = {
    "thumbnail.frequency": {
        optional: true,
        isInt: { min: 1, max: 200, default: 25, errorMessage: "Thumbnail frequency must be between 1 and 200 frames." },
    },
};
