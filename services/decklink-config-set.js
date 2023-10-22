const logger = require("@utils/logger")(module);
const os = require("os");

module.exports = async (index) => {
    if (os.arch() === "x64") {
        const macadam = require("macadam");
        let status;
        try {
            status = await macadam.setDeviceConfig({
                deviceIndex: parseInt(index),
                duplexMode: macadam.bmdDuplexModeFull,
            });
        } catch (error) {
            status = false;
            logger.warn(error);
        }
        return status;
    } else {
        throw new Error(`Invalid Architecute - ${os.arch()}`);
    }
};
