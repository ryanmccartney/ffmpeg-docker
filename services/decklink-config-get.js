const macadam = require('macadam');

module.exports = async (index) => {
    const deviceInfo = await macadam.getDeviceConfig(index);
    return deviceInfo;
}