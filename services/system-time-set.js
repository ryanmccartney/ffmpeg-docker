"use strict";

const logger = require("@utils/logger")(module);
const NTP = require('ntp-time').Client;

module.exports = async (ntpServer="uk.pool.ntp.org") => {
    try {
        const client = new NTP(ntpServer, 123, { timeout: 5000 });
		await client.syncTime();
        return { data: client };
    } catch (error) {
        logger.warn("Cannot probe media " + error.message);
        return { error: error.toString() };
    }
};
