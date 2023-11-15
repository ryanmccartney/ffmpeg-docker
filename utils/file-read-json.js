"use strict";

const { promises: fs } = require("fs");

module.exports = async (filename) => {
    const fileJson = await fs.readFile(filename);
    return JSON.parse(fileJson);
};
