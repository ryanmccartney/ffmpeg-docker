const crypto = require("crypto");

let maxQueueSize = process.env.QUEUE_SZIE | 5;
let jobs = {};

const start = (output) => {
    const queueSize = Object.keys(jobs).length;
    if (queueSize < maxQueueSize) {
        const hash = crypto.createHash("md5").update(output).digest("hex");
        if (!jobs[hash]) {
            jobs[hash] = { jobNumber: Object.keys(jobs).length + 1, jobId: hash, started: new Date() };
            return jobs[hash];
        } else {
            throw new Error("Job is already running.");
        }
    } else {
        throw new Error("Job queue is full, cancel a job or wait to one is finished before starting another.");
    }
};

const update = (hash, update) => {
    if (jobs[hash]) {
        jobs[hash] = { ...jobs[hash], ...update };
        return jobs[hash];
    } else {
        throw new Error("Job does not exist.");
    }
};

const end = (hash, kill = true) => {
    if (jobs[hash]) {
        const job = jobs[hash];
        if (kill) {
            process.kill(jobs[hash].pid, "SIGINT");
        }
        job.ended = new Date();
        job.duration = job.ended - job.started;
        delete jobs[hash];
        return job;
    } else {
        return { error: "Job does not exist." };
    }
};

const get = (output) => {
    const hash = crypto.createHash("md5").update(output).digest("hex");
    if (jobs[hash]) {
        return jobs[hash];
    } else {
        return false;
    }
};

const getbyId = (hash) => {
    if (jobs[hash]) {
        return jobs[hash];
    } else {
        return false;
    }
};

const getAll = () => {
    return jobs;
};

module.exports = { end: end, update: update, start: start, get: get, getbyId: getbyId, getAll: getAll };
