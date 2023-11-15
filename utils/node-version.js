"use strict";

const { execSync } = require("child_process");

module.exports = async () => {
    const revision = await execSync(`node --version`).toString().trim();
    return revision;
};
