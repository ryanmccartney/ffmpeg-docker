"use strict";

const { promises: fs } = require("fs");

module.exports = async (file) => {
    const fileContents = await fs.readFile(file);
    return fileContents.toString().trim();
};
