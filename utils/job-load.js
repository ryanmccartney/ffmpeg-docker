"use strict";

const logger = require("@utils/logger")(module);
const jobManager = require("@utils/jobManager");
const pidusage = require("pidusage");

module.exports = async () => {
    let usage = {};
    const pids = [];
    const jobs = jobManager.getAll();

    for (let [jobId, job] of Object.entries(jobs)) {
        pids.push(job?.pid);
    }

    if (pids.length > 0) {
        usage = await pidusage(pids);
    }

    for (let [jobId, job] of Object.entries(jobs)) {
        usage[jobId] = usage[job?.pid];
        usage[jobId].cpu = usage[jobId].cpu / 100;
        jobManager.update(jobId, { load: usage[job?.pid] });
        delete usage[job?.pid];
    }

    return usage;
};
