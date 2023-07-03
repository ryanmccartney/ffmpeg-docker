const macadam = require('macadam');

module.exports = async (index) => {
    try{
        const deviceInfo = await macadam.getDeviceConfig(parseInt(index));
        return deviceInfo;
    }
    catch(error){
        return false
    }
}