"use strict";

const logger = require("@utils/logger")(module);
const checkDiskSpace = require("check-disk-space").default;
const os = require("os");
const path = require("path");

const interval = 1000;
let load = 0;
let cpus = {};
let cpusPrevious = os.cpus();

setInterval(() => {
    cpus = os.cpus();
    let loadTotal = 0;

    for (let i in cpus) {
        const usagePrevious = cpusPrevious[i].times?.user + cpusPrevious[i].times?.sys + cpusPrevious[i].times?.irq;
        const usage = cpus[i].times?.user + cpus[i].times?.sys + cpus[i].times?.irq;

        const load = (usage - usagePrevious) / interval;
        cpus[i].load = Math.round(load * 100) / 100;

        loadTotal += load;
    }

    load = Math.round((loadTotal / cpus.length) * 100) / 100;
    cpusPrevious = cpus;
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
