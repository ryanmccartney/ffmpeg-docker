"use strict";

const { execSync } = require("child_process");

module.exports = async (directory) => {
    const revision = await execSync(
        `cd ${directory} && git config --global --add safe.directory ${directory} && git rev-parse HEAD`
    )
        .toString()
        .trim();
    return revision;
};
