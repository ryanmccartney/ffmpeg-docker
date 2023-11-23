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

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const helmet = require("helmet");
const httpLogger = require("@utils/http-logger");
const mustacheExpress = require("mustache-express");
const rateLimit = require("express-rate-limit");

// rate limiting
const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: process.env.RATE_LIMIT || 1000,
});

// get environment
const nodeEnv = process.env.NODE_ENV || "production";

// load routes
const documentation = require("@utils/documentation");
const pageRouter = require("@routes/page");
const systemRouter = require("@routes/system");
const playlistRouter = require("@routes/playlist");

const authRouter = require("@routes/auth");
const hlsRouter = require("@routes/hls");
const udpRouter = require("@routes/udp");
const rtpRouter = require("@routes/rtp");
const srtRouter = require("@routes/srt");
const barsRouter = require("@routes/bars");
const fileRouter = require("@routes/file");
const audioRouter = require("@routes/audio");
const vmafRouter = require("@routes/vmaf");
const decklinkRouter = require("@routes/decklink");

const app = express();

app.engine("html", mustacheExpress(path.join(__dirname, "..", "views", "partials"), ".html"));
app.set("view engine", "html");
app.set("views", path.join(__dirname, "..", "views"));
app.disable("view cache");

app.set("json spaces", 2);
app.use(httpLogger);
app.use(cors());
app.use(
    helmet.contentSecurityPolicy({
        reportOnly: true,
        directives: {
            upgradeInsecureRequests: null,
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "https:", "http:", "'unsafe-inline'"],
            defaultSrc: ["'self'"],
            "base-uri": ["'self'"],
            "block-all-mixed-content": [],
            "font-src": ["'self'", "https:", "http:", "data:"],
            "frame-ancestors": ["'self'"],
            "img-src": ["'self'", "data:", "https:"],
            "object-src": ["'none'"],
        },
    })
);

app.use(favicon(path.join(__dirname, "..", "public", "images", "favicon.ico")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", apiLimiter);
app.use("/documentation", documentation);
app.use("/api/system", systemRouter);
app.use("/api/playlist", playlistRouter);
app.use("/api/hls", hlsRouter);
app.use("/api/auth", authRouter);

//Input Routes /api/INPUT_FORMAT/OUTPUT_FORMAT
app.use("/api/vmaf", vmafRouter);
app.use("/api/decklink", decklinkRouter);
app.use("/api/audio", audioRouter);
app.use("/api/file", fileRouter);
app.use("/api/udp", udpRouter);
app.use("/api/srt", srtRouter);
app.use("/api/rtp", rtpRouter);
app.use("/api/bars", barsRouter);

// Redirect /api to /documentation
app.use("/api", (req, res, next) => {
    res.redirect("/documentation");
});

// Server routes for web GUI
if (process.env.WEB_GUI) {
    app.use("/", pageRouter);
    app.use("/public", express.static(path.join(__dirname, "..", "public")));
    app.use("/public/bootstrap", express.static(path.join(__dirname, "..", "node_modules", "bootstrap", "dist")));
    app.use("/public/bootstrap-icons", express.static(path.join(__dirname, "..", "node_modules", "bootstrap-icons")));
    app.use("/public/chart.js", express.static(path.join(__dirname, "..", "node_modules", "chart.js", "dist")));
    app.use("/public/video.js", express.static(path.join(__dirname, "..", "node_modules", "video.js", "dist")));
    app.use("/public/gauge.js", express.static(path.join(__dirname, "..", "node_modules", "gaugeJS", "dist")));
    app.use("/public/decklink", express.static(path.resolve("/decklink")));
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("File Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        status: error.status,
        message: error.message,
        stack: nodeEnv !== "production" ? error.stack.split("\n") : undefined,
    });
});

module.exports = app;
