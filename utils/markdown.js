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

const swaggerJsdoc = require("swagger-jsdoc");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const host = process.env.HOST || "localhost";
const port = process.env.PORT || "80";
const url = `http://${host}:${port}/api/`;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "FFmpeg Docker API",
            version: "0.1.0",
            description: "Common FFmpeg functions from a RESTful API",
            license: {
                name: "GPLv3",
                url: "https://www.gnu.org/licenses/gpl-3.0.en.html",
            },
            contact: {
                name: "Ryan McCartney",
                url: "https://ryan.mccartney.info/ffmpeg-docker",
                email: "ryan@mccartney.info",
            },
        },
        servers: [
            {
                url: url,
            },
        ],
    },
    apis: ["./routes/*.js", "./modules/*.js"],
};

const main = async () => {
    const swaggerJsonSpec = swaggerJsdoc(options);
    const swaggerYamlSpec = YAML.stringify(swaggerJsonSpec);
    fs.writeFileSync(path.join("docs", "assets", "api-spec.yml"), swaggerYamlSpec);
};

main();
