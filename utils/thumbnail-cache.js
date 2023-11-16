const NodeCache = require("node-cache");
const thumbnailCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

module.exports = thumbnailCache;
