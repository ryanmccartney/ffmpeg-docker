const logger = require("@utils/logger")(module);
const sharp = require("sharp");
const path = require("path");
const NodeCache = require("node-cache");
const thumbnailCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

module.exports = async (jobId, resize = 0.2) => {
    try {
        const resizedThumbnail = await sharp(path.join(__dirname, "..", "data", "thumbnail", `${jobId}.png`))
            .resize(parseInt(1920 * resize), parseInt(1080 * resize))
            .png()
            .toBuffer();

        await thumbnailCache.set(jobId, resizedThumbnail);

        return `data:image/png;base64,${resizedThumbnail.toString("base64")}`;
    } catch (error) {
        let fallbackThumbnail = await thumbnailCache.get(jobId);

        if (!fallbackThumbnail) {
            fallbackThumbnail = await sharp({
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
        }

        return `data:image/png;base64,${fallbackThumbnail.toString("base64")}`;
    }
};
