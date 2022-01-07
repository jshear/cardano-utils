const commonUtils = require('./modules/common');
const serializationClient = require('./modules/serialization-client');
const BlockfrostClient = require('./modules/blockfrost-client');

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

const CardanoUtils = (function(blockfrostProjectId, testnet, customLog) {

    const state = {};
    state.blockfrostClient = null;
    if (blockfrostProjectId) state.blockfrostClient = new BlockfrostClient(blockfrostProjectId, testnet);

    // If customLog is null, logging is disabled -- if customLog is not provided, a default logger is used
    const log = (customLog === undefined) ? defaultLogger : (customLog ? customLog : nullLogger);

    function validateSignedMessage(message, address, payload) {
        try {
            const handler = serializationClient.getSignedMessageHandler(message);
            handler.verify(address, payload);
        } catch(err) {
            log.error('Invalid signed message', err);
            return false;
        }

        return true;
    }

    function getStakeAddress(address) {
        try {
            return serializationClient.addressHelper.getStakeAddress(address);
        } catch(err) {
            log.error('Unable to determine stake address', err);
            return null;
        }
    }

    async function getNFTAssetOwner(policyId, assetName) {
        if (!state.blockfrostClient) throw new Error('BlockFrost is unavailable -- no project ID was provided');
        return state.blockfrostClient.getNFTAssetOwner(policyId, assetName).catch(err => {
            log.error(`Unable to obtain NFT asset owner for ${policyId}.${assetName}`, err);
            return null;
        });
    }

    async function getAssetOwners(policyId, assetName) {
        if (!state.blockfrostClient) throw new Error('BlockFrost is unavailable -- no project ID was provided');
        return state.blockfrostClient.getAssetOwners(policyId, assetName).catch(err => {
            log.error(`Unable to obtain asset owners for ${policyId}.${assetName}`, err);
            return null;
        });
    }

    async function getOwnedAssets(address, policyId) {
        const stakeAddr = getStakeAddress(address);
        if (!state.blockfrostClient) throw new Error('BlockFrost is unavailable -- no project ID was provided');
        return state.blockfrostClient.getOwnedAssets(stakeAddr, policyId).catch(err => {
            log.error(`Unable to obtain owned assets for ${stakeAddr}.${policyId}`, err);
            return null;
        });
    }

    async function getPolicyAssets(policyId) {
        if (!state.blockfrostClient) throw new Error('BlockFrost is unavailable -- no project ID was provided');
        return state.blockfrostClient.getPolicyAssets(policyId).catch(err => {
            log.error(`Unable to obtain policy assets for ${policyId}`, err);
            return null;
        });
    }

    async function getAssetData(policyId, assetName) {
        if (!state.blockfrostClient) throw new Error('BlockFrost is unavailable -- no project ID was provided');
        return state.blockfrostClient.getAssetData(policyId, assetName).catch(err => {
            log.error(`Unable to obtain asset data for ${policyId}.${assetName}`, err);
            return null;
        });
    }

    // Public interface
    return {
        validateSignedMessage: validateSignedMessage,
        getStakeAddress: getStakeAddress,
        convertToHex: commonUtils.converToHex,
        convertFromHex: commonUtils.convertFromHex,
        getSlot: commonUtils.getSlot,
        getNFTAssetOwner: getNFTAssetOwner,
        getAssetOwners: getAssetOwners,
        getOwnedAssets: getOwnedAssets,
        getPolicyAssets: getPolicyAssets,
        getAssetData: getAssetData
    };
});

module.exports = (blockfrostProjectId, testnet, customLog) => new CardanoUtils(blockfrostProjectId, testnet, customLog);
