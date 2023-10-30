const logger = require("@utils/logger")(module);
const os = require("os");

module.exports = async () => {
    if (os.arch() === "x64" && os.platform() === "linux") {
        const os = require("os");
        const macadam = require("macadam");
        const deviceInfo = await macadam.getDeviceInfo();
        return { devices: deviceInfo };
    } else {
        logger.error(`Invalid Architecture - this command is not supported on ${os.platform()}-${os.arch()}`);
        return {
            error: "Invalid Architecture - this command is not supported on your system architecture",
            arch: os.arch(),
            platform: os.platform(),
        };
    }
};
