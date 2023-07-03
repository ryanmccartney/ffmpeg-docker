const macadam = require('macadam');

module.exports = async (index) => {
    const status = await macadam.setDeviceConfig({
        deviceIndex: index,
        duplexMode: macadam.bmdDuplexModeFull
    });
    return status;
}