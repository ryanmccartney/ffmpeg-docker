const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "data", "media"));
    },
    filename: (req, file, cb) => {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, `${file.originalname.split(".")[0]}.${extension}`);
    },
});

module.exports = multer({
    storage: storage,
}).single("media");
