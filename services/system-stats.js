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

const logger = require("@utils/logger")(module);
const checkDiskSpace = require("check-disk-space").default;
const os = require("os");
const jobLoad = require("@utils/job-load");
const path = require("path");

const interval = 1000;
let load = 0;
let cpus = {};
let cpusPrevious = os.cpus();
let jobs = {};

setInterval(async () => {
    try {
        cpus = os.cpus();
        let loadTotal = 0;
        jobs = await jobLoad();

        for (let i in cpus) {
            const usagePrevious = cpusPrevious[i].times?.user + cpusPrevious[i].times?.sys + cpusPrevious[i].times?.irq;
            const usage = cpus[i].times?.user + cpus[i].times?.sys + cpus[i].times?.irq;

            const load = (usage - usagePrevious) / interval;
            cpus[i].load = Math.round(load * 100) / 100;

            loadTotal += load;
        }

        load = Math.round((loadTotal / cpus.length) * 100) / 100;
        cpusPrevious = cpus;
    } catch (error) {}
}, interval);

module.exports = async () => {
    try {
        const disk = await checkDiskSpace(process.env.MEDIA_PATH || path.join(__dirname, "..", "data", "media"));
        disk.usage = (disk.size - disk.free) / disk.size;
        disk.usage = Math.round(disk.usage * 100) / 100;

        return {
            time: new Date(),
            cores: cpus.length,
            load: load,
            cpu: cpus,
            env: process.env,
            jobs: jobs,
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                usage: Math.round(((os.totalmem - os.freemem()) / os.totalmem) * 100) / 100,
            },
            network: os.networkInterfaces(),
            platform: os.platform(),
            uptime: os.uptime(),
            disk: disk,
        };
    } catch (error) {
        return { error: error.toString() };
    }
};
