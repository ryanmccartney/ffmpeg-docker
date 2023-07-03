const macadam = require('macadam');

module.exports = async () => {
    const deviceInfo = await macadam.getDeviceInfo();
    return deviceInfo;
}