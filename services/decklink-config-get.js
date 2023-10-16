const logger = require("@utils/logger")(module);

module.exports = async (index) => {
    console.log(os.arch());
    if (os.arch()) {
        const macadam = require("macadam");
        const deviceInfo = await macadam.getDeviceConfig(parseInt(index));
        return deviceInfo;
    } else {
        throw new Error(`Invalid Architecute - ${os.arch()}`);
    }
};
