"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");
const qr = require("@utils/qr");

module.exports = async (command,qrData) => {
    try {
        if(qrData){

            const data = await qr(qrData);         
            const QrType = qrData?.type || "png";
            const qrCodePath = path.join(
                __dirname,
                "..",
                "data",
                "qr",
                qrData?.file+"."+QrType);

            command.input(qrCodePath);
            command.complexFilter([
                {
                  filter: 'overlay',
                  options: { shortest: 1 },
                  inputs: ['0:v', '1'],
                  outputs: 'output',
                },
            ], 'output');
        }
    } catch (error) {
        logger.warn("Cannot create QR code filter ");
        logger.warn(error)
    }
    return command
};