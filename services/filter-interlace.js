"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const parse = require("@utils/parse");

module.exports = async (interlace = false, fieldorder = "tff") => {
    const filters = [];
    try {
        if (interlace) {
            filters.push({
                filter: `yadif`,
                //  options: { mode: 1, parity: "t", deint: 0 },
            });
        }
    } catch (error) {
        logger.warn("Cannot create interalcing filter " + error.message);
    }
    return filters;
};
