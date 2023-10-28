"use strict";

const logger = require("@utils/logger")(module);
const path = require("path");

module.exports = async (options = {}) => {
    let filters = [];
    try {
        if(options.audioMeter){
            filters = [
                {
                    filter: 'amovie',
                    options: '1:d=0',
                    outputs: 'volume',
                  },
                  {
                    filter: 'showvolume',
                    inputs: 'volume',
                    outputs: 'volume_info',
                  },
                  {
                    filter: 'drawtext',
                    options: "text='Volume\: %{metadata=lavfi.showvolume.volume': x=(w-tw-10): y=(h-th-10): fontcolor=white: fontsize=24: box=1: boxcolor=black'",
                    inputs: 'volume_info',
                    outputs: 'output',
                  },
            ]
        }
       
    } catch (error) {
        logger.warn("Cannot create text filter " + error.message);
    }
    return filters
};