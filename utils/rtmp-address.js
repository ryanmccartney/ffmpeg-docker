"use strict";

module.exports = (address, path = "", key) => {
    let fullAddress = `rtmp://${address}${path}`;
    if (key) {
        fullAddress += `/${key}`;
    }
    return fullAddress;
};
