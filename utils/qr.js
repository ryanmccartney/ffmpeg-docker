"use strict";

const logger = require("@utils/logger")(module);
const util = require('util')
const path = require("path");
const QRCode = require('qrcode')
const parse = require("@utils/parse");

module.exports = async (qr) => {
    const response = {status: true, data:{}}
    try{

        const QrType = qr?.type || "png";
        const qrCodePath = path.join(
            __dirname,
            "..",
            "data",
            "qr",
            qr?.file+"."+QrType);

        response.data = await QRCode.toFile(qrCodePath,await parse(qr?.text,qr),{
            type: QrType,
            color: {
                dark: `${qr.color || "#FFF"}`, 
                light: `${qr.background || "#000"}`
            }
            }   
        );
    }
    catch(error){
        logger.warn(error)
        response.status = false
        response.error = error;
    }
};