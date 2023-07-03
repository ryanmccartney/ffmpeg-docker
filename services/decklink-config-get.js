const macadam = require('macadam');
const logger = require("@utils/logger")(module);

module.exports = async (index) => {
    try{
        const deviceInfo = await macadam.getDeviceConfig(parseInt(index));
        return deviceInfo;
    }
    catch(error){
        logger.error(error)
        return false
    }
}