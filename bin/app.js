const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const favicon = require("serve-favicon");
const helmet = require("helmet");
const httpLogger = require("@utils/http-logger");

// get environment
const nodeEnv = process.env.NODE_ENV || "production";

// load routes
const documentation = require("@utils/documentation");
const pageRouter = require("@routes/page");
const systemRouter = require("@routes/system");
const encodeRouter = require("@routes/encode");
const decodeRouter = require("@routes/decode");
const vmafRouter = require("@routes/vmaf");
const decklinkRouter = require("@routes/decklink");
const fileRouter = require("@routes/file");
const playlistRouter = require("@routes/playlist");

const app = express();

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
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./data/upload",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/documentation", documentation);
app.use("/api/system", systemRouter);
app.use("/api/encode", encodeRouter);
app.use("/api/decode", decodeRouter);
app.use("/api/vmaf", vmafRouter);
app.use("/api/decklink", decklinkRouter);
app.use("/api/file", fileRouter);
app.use("/api/playlist", playlistRouter);
app.use("/api/hls", express.static(path.join(__dirname, "..", "data", "hls")));

// Redirect /api to /documentation
app.use("/api", function (req, res, next) {
    res.redirect("/documentation");
});

// Server routes for web GUI
if (process.env.WEB_GUI) {
    app.use("/", pageRouter);
    app.use("/public", express.static(path.join(__dirname, "..", "public")));
    app.use("/public/bootstrap", express.static(path.join(__dirname, "..", "node_modules", "bootstrap", "dist")));
    app.use("/public/chart.js", express.static(path.join(__dirname, "..", "node_modules", "chart.js", "dist")));
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error("File Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function (error, req, res, next) {
    res.status(error.status || 500).json({
        status: error.status,
        message: error.message,
        stack: nodeEnv !== "production" ? error.stack.split("\n") : undefined,
    });
});

module.exports = app;
