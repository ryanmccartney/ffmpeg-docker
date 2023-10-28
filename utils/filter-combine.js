"use strict";

const logger = require("@utils/logger")(module);

module.exports = async (...filter) => { 
    let filters = [];
    try {
        const length = filter.length
        for( let i=0; i < length; i += 1 ){
            if(Array.isArray(filter[i])){
                filters = filters.concat(filter[i]);
            }
        }
    } catch (error) {
        logger.warn("Cannot concatenate filters " + error.message);
    }
    return filters
};


