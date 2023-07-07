const macadam = require('macadam');
const logger = require("@utils/logger")(module);

module.exports = async (index) => {
    let status
    try{
        status = await macadam.setDeviceConfig({
            deviceIndex: parseInt(index),
            duplexMode: macadam.bmdDuplexModeFull
        });
    }
    catch(error){
        status = false;
        logger.warn(error);
    }
    return status;
}