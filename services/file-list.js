"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const fs = require("fs");
const util = require("util");

const readdir = util.promisify(fs.readdir);

module.exports = async (options) => {
    try {
        const directoryPath = path.join(process.cwd(), "data", "media");
        const files = await readdir(directoryPath, { withFileTypes: options?.extensions || true });
        const filesDetail = [];

        for (let file of files) {
            if (file.name !== ".gitkeep") {
                const stat = await fs.promises.stat(path.join(directoryPath, file.name));
                filesDetail.push({
                    name: file.name,
                    size: stat.size,
                    ctime: stat.ctime,
                });
            }
        }

        return { files: filesDetail };
    } catch (error) {
        logger.warn(`Cannot list files ${error.message}`);
        return { errors: [error] };
    }
};
