const logger = require("@utils/logger")(module);
const os = require("os");

module.exports = async (options) => {
    if (os.arch() === "x64" && os.platform() === "linux") {
        const macadam = require("macadam");
        let status;
        try {
            status = await macadam.setDeviceConfig({
                deviceIndex: parseInt(options?.cardIndex || 0),
                duplexMode: macadam.bmdDuplexModeFull,
            });
        } catch (error) {
            status = false;
            logger.warn(error);
        }
        return status;
    } else {
        logger.error(`Invalid Architecture - this command is not supported on ${os.arch()}`);
        return {
            error: "Invalid Architecture - this command is not supported on your system architecture",
            arch: os.arch(),
        };
    }
};
