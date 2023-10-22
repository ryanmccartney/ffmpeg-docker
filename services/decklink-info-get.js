const os = require("os");

module.exports = async () => {
    console.log(os.arch());
    if (os.arch() === "x64") {
        const macadam = require("macadam");
        const deviceInfo = await macadam.getDeviceInfo();
        return deviceInfo;
    } else {
        throw new Error(`Invalid Architecute - ${os.arch()}`);
    }
};
