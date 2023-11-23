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

const md5 = require("md5");

module.exports = (res, req, contents) => {
    const response = contents;
    const meta = {
        hash: md5(response),
        request_url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
        request_method: req.method,
        request_body: req.body,
        user: req.user,
    };

    response.meta = meta;
    res.header("Content-Type", "application/json");
    res.json(response);
};
