const logger = require("@utils/logger")(module);
const os = require("os");

module.exports = async (index) => {
    if (os.arch() === "x64") {
        const os = require("os");
        const macadam = require("macadam");
        const deviceInfo = await macadam.getDeviceInfo();
        return deviceInfo;
    } else {
        throw new Error(`Invalid Architecute - ${os.arch()}`);
    }
};
