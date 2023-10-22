"use strict";

const logger = require("@utils/logger")(module);
const os = require("os");

module.exports = async () => {
    try {
        const cpuUsage = [];
        let cpuUsageTotal = 0;

        for (let cpu of os.cpus()) {
            const cpuUsagePercentage = (cpu?.times?.user + cpu?.times?.sys) / cpu?.times?.idle;
            cpuUsageTotal += cpuUsagePercentage;
            cpuUsage.push(Math.round(cpuUsagePercentage * 100) / 100);
        }

        cpuUsageTotal = cpuUsageTotal / os.cpus().length;
        cpuUsageTotal = Math.round(cpuUsageTotal * 100) / 100;

        return {
            time: new Date(),
            cpuUsageTotal: cpuUsageTotal,
            cpuUsage: cpuUsage,
            cores: os.cpus().length,
            cpu: os.cpus(),
            memoryTotal: os.totalmem(),
            memoryFree: os.freemem(),
            memoryUsage: Math.round((os.freemem() / os.totalmem) * 100) / 100,
            network: os.networkInterfaces(),
            platform: os.platform(),
            uptime: os.uptime(),
        };
    } catch (error) {
        return { error: error.toString() };
    }
};
