"use strict";

const logger = require("@utils/logger")(module);


// "frameNum": 0,
// "metrics": {
//     "integer_adm2": 0.972270,
//     "integer_adm_scale0": 0.970884,
//     "integer_adm_scale1": 0.964849,
//     "integer_adm_scale2": 0.977850,
//     "integer_adm_scale3": 0.971833,
//     "integer_motion2": 0.000000,
//     "integer_motion": 0.000000,
//     "integer_vif_scale0": 0.570051,
//     "integer_vif_scale1": 0.889042,
//     "integer_vif_scale2": 0.930582,
//     "integer_vif_scale3": 0.952735,
//     "psnr": 37.205054,
//     "ssim": 0.987119,
//     "ms_ssim": 0.984290,
//     "vmaf": 84.659084

module.exports = async (json = {frames:[]}) => {
    let csvData = "Frame Number,PSNR,SSIM,VMAF\n";
    try {
        for(let frame of json?.frames){
            const csvLine = `${frame?.frameNum},${frame?.metrics?.psnr},${frame?.metrics?.ssim},${frame?.metrics?.vmaf}\n`;
            csvData += csvLine;
        }
    } catch (error) {
        logger.warn(error);
    }
    return csvData;
};