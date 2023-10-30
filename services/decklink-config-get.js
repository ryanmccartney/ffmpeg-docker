const logger = require("@utils/logger")(module);
const os = require("os");

module.exports = async () => {
    if (os.arch() === "x64") {
        const os = require("os");
        const macadam = require("macadam");
        const deviceInfo = await macadam.getDeviceInfo();
        return { devices: deviceInfo };
    } else {
        logger.error(`Invalid Architecture - this command is not support on ${os.arch()}`);
        return {
            error: "Invalid Architecture - this command is not support on your system architecture",
            arch: os.arch(),
        };
    }
};
