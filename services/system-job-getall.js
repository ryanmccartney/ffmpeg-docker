"use strict";

const logger = require("@utils/logger")(module);
const jobManager = require("@utils/jobManager");

module.exports = async () => {
    try {
        const jobs = jobManager.getAll();
        return jobs;
    } catch (error) {
        logger.warn(error.message);
        return { error: error.toString() };
    }
};
