const logger = require("@utils/logger")(module);
const os = require("os");

module.exports = async (index) => {
    if (os.arch() === "x64") {
        const macadam = require("macadam");
        const deviceInfo = await macadam.getDeviceConfig(parseInt(index));
        return deviceInfo;
    } else {
        throw new Error(`Invalid Architecute - ${os.arch()}`);
    }
};
