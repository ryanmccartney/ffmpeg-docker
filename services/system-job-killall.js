"use strict";

const logger = require("@utils/logger")(module);
const jobManager = require("@utils/jobManager");

module.exports = async () => {
    try {
        const jobs = jobManager.getAll();

        for (let [jobId, job] of Object.entries(jobs)) {
            logger.info(`Killing job ${job?.jobId}`);
            jobManager.end(job?.jobId);
        }

        return jobs;
    } catch (error) {
        logger.warn(error.message);
        return { error: error.toString() };
    }
};
