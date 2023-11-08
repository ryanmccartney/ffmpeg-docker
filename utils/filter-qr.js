"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const qr = require("@utils/qr");
const imageFilter = require("@utils/filter-image");

module.exports = async (command, options) => {
    try {
        if (options.overlay.qr && options.overlay.qr.data) {
            const data = await qr(options.overlay.qr);

            options.overlay.image.file = path.join(__dirname, "..", "data", "qr", qrData?.file);
            options.overlay.image.format = options.overlay.qr?.type || "png";
            options.overlay.image.size = options.overlay.qr?.size || 20;
            options.overlay.image.location = {
                x: options?.overlay?.qr?.location?.x || 0,
                y: options?.overlay?.qr?.location?.y || 0,
            };

            command = imageFilter(command, options);
        }
    } catch (error) {
        logger.warn("Cannot create QR code filter ");
        logger.warn(error);
    }
    return command;
};
