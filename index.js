import * as commonUtils from './modules/common/index.js';

const defaultLogger = {
    info: console.log,
    warn: console.log,
    error: console.log
};

const nullLogger = {
    info: () => {},
    warn: () => {},
    error: () => {}
};

const CardanoUtils = (function(testnet, customLog) {

    const state = {};
    state.testnet = !!testnet;

    // If customLog is null, logging is disabled -- if customLog is not provided, a default logger is used
    const log = (customLog === undefined) ? defaultLogger : (customLog ? customLog : nullLogger);

    // Public interface
    return {
        core: {
            stringToHex: commonUtils.stringToHex,
            stringFromHex: commonUtils.stringFromHex,
            getSlot: (timestamp) => { return commonUtils.getSlot(timestamp, state.testnet); }
        }
    };
});

export default (testnet, customLog) => new CardanoUtils(testnet, customLog);
