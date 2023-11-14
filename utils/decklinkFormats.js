"use strict";

module.exports = [
    {
        rawFormat: "auto",
        description:
            "This is the default which means 8-bit YUV 422 or 8-bit ARGB if format autodetection is used, 8-bit YUV 422 otherwise.",
    },
    {
        rawFormat: "uyvy422",
        description: "8-bit YUV 422",
    },
    {
        rawFormat: "yuv422p10",
        description: "10-bit YUV 422",
    },
    {
        rawFormat: "argb",
        description: "8-bit RGB",
    },
    {
        rawFormat: "bgra",
        description: "8-bit RGB",
    },
    {
        rawFormat: "rgb10",
        description: "10-bit RGB",
    },
];
