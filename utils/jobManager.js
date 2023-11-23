/*
FFmpeg Docker, an API wrapper around FFmpeg running in a configurable docker container
Copyright (C) 2022 Ryan McCartney

This file is part of the FFmpeg Docker (ffmpeg-docker).

FFmpeg Docker is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

"use strict";

const crypto = require("crypto");
const fileDelete = require("@utils/file-delete");
const thumbnailCache = require("@utils/thumbnail-cache");

let maxQueueSize = process.env.QUEUE_SIZE || 5;
let jobs = {};

const start = (output, name = "FFmpeg Process", type = ["default"]) => {
    const queueSize = Object.keys(jobs).length;
    if (queueSize < maxQueueSize) {
        const hash = crypto.createHash("md5").update(output).digest("hex");
        if (!jobs[hash]) {
            jobs[hash] = {
                jobNumber: Object.keys(jobs).length + 1,
                jobId: hash,
                started: new Date(),
                jobName: name,
                type: type,
            };
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
        return { error: "Job does not exist." };
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

        fileDelete(`data/thumbnail/${job.jobId}.png`);
        thumbnailCache.del(job.jobId);

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
