"use strict";

const validator = require("validator");

module.exports = (value, { req, location, path }) => {
    return validator.isIP(value) || validator.isFQDN(value);
};
