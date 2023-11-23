/*
FFmpeg Docker, an API wrapper around FFmpeg running in a configurable docker container
Copyright (C) 2022 Ryan McCartney

This file is part of the FFmpeg Docker (ffmpeg-docker).

FFmpeg Docker is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

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
