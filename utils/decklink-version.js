"use strict";

const { execSync } = require("child_process");
const { version } = require("os");

module.exports = async () => {
    let decklinkObject = {};
    const decklink = await execSync(`dpkg -l | grep -i blackmagic`).toString().trim();

    if (decklink) {
        const items = decklink.split("        ");
        decklinkObject.version = items[2].trim();
        decklinkObject.arch = items[5].trim();
        decklinkObject.name = items[6].trim();
    }

    return decklinkObject;
};
