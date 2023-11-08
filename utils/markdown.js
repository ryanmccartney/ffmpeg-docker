const swaggerJsdoc = require("swagger-jsdoc");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const host = process.env.HOST || "localhost";
const port = process.env.PORT || "80";
const url = `http://${host}:${port}/api/`;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "FFmpeg Docker API",
            version: "0.1.0",
            description: "Common FFmpeg functions from a RESTful API",
            license: {
                name: "GPLv3",
                url: "https://www.gnu.org/licenses/gpl-3.0.en.html",
            },
            contact: {
                name: "Ryan McCartney",
                url: "https://ryan.mccartney.info/ffmpeg-docker",
                email: "ryan@mccartney.info",
            },
        },
        servers: [
            {
                url: url,
            },
        ],
    },
    apis: ["./routes/*.js", "./modules/*.js"],
};

const main = async () => {
    const swaggerJsonSpec = swaggerJsdoc(options);
    const swaggerYamlSpec = YAML.stringify(swaggerJsonSpec);
    fs.writeFileSync(path.join("docs", "assets", "api-spec.yml"), swaggerYamlSpec);
};

main();
