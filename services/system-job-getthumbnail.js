const logger = require("@utils/logger")(module);
const sharp = require("sharp");
const path = require("path");

module.exports = async (jobId, resize = 0.2) => {
    try {
        const resizedThumbnail = await sharp(path.join(__dirname, "..", "data", "thumbnail", `${jobId}.png`))
            .resize(parseInt(1920 * resize), parseInt(1080 * resize))
            .png()
            .toBuffer();

        return `data:image/png;base64,${resizedThumbnail.toString("base64")}`;
    } catch (error) {
        logger.error(error);
        const background = await sharp({
            create: {
                width: 48,
                height: 48,
                channels: 3,
                background: { r: 0, g: 0, b: 0 },
            },
        })
            .resize(parseInt(1920 * resize), parseInt(1080 * resize))
            .png()
            .toBuffer();
        return `data:image/png;base64,${background.toString("base64")}`;
    }
};
