"use strict";

const { execSync } = require("child_process");

module.exports = async () => {
    const osObject = {};
    const os = await execSync(`cat /etc/os-release`).toString().trim();

    for (let line of os.split("\n")) {
        const item = line.split("=");
        osObject[item[0].toLowerCase()] = item[1].replace(/"/g, ``).trim();
    }

    return osObject;
};
