const { convertToHex, convertFromHex } = require('../common');

class BlockfrostClient {

    constructor(projectId, testnet) {
        if (!projectId) throw new Error('Project ID is required for BlockFrost interaction');
        this.projectId = projectId;
        this.testnet = !!testnet;
        this.baseUrl = testnet ? 'https://cardano-testnet.blockfrost.io/api/v0' : 'https://cardano-mainnet.blockfrost.io/api/v0';
    }

    async getNFTAssetOwner(policyId, assetName) {
        return fetch(this._getAssetOwnersEndpoint(policyId, assetName, 1), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'project_id': this.projectId
                }
            }).then(response => {
                if (!response.ok) throw new Error('Asset ownership data is unavailable for ' + policyId + '-' + assetName);

                return response.json();
            })
            .then(jsonData => {
                if (!jsonData || !Array.isArray(jsonData) || jsonData.length !== 1)
                    throw new Error('Invalid asset ownership data for ' + policyId + '-' + assetName);

                return jsonData[0].address;
            });
    }

    async getAssetOwners(policyId, assetName) {
        const owners = {};
        let page = 0;
        let stop = false;
        while (!stop) {
            const res = fetch(this._getAssetOwnersEndpoint(policyId, assetName, page++), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'project_id': this.projectId
                }
            }).then(response => {
                if (!response.ok) throw new Error('Asset ownership data is unavailable for ' + policyId + '.' + assetName);

                return response.json();
            })
            .then(jsonData => {
                if (!jsonData || !Array.isArray(jsonData))
                    throw new Error('Invalid asset ownership data for ' + policyId + '.' + assetName);

                for (const ownerEntry of jsonData) {
                    owners[ownerEntry.address] = parseInt(ownerEntry.quantity);
                }

                stop = (jsonData.length === 0);
            });
        }

        return owners;
    }

    async getOwnedAssets(stakeAddr, policyId) {
        const assets = await this._getAllPages(this._getOwnedAssetsEndpoint(stakeAddr));
        return assets.filter(asset => {
            return !policyId || asset.unit.includes(policyId);
        }).map(asset => {
            // Get asset name
            const assetName = convertFromHex(asset.unit.replace(policyId, ''));
            if (policyId) return assetName;
            // If no policy was specified, include the policy in the asset identifier
            return policyId + '.' + assetName;
        });
    }

    async getPolicyAssets(policyId) {
        const assets = await this._getAllPages(this._getAssetsForPolicyEndpoint(policyId));

        // There is a race condition between pages -- make sure there are no repeats
        const assetFingerprints = {};

        return assets.map(asset => {
            if (assetFingerprints[asset.asset]) throw new Error('Duplicate asset entry for ' + asset.asset);
            assetFingerprints[asset.asset] = true;
            return {
                name: convertFromHex(asset.asset.substr(policyId.length)),
                asset: asset.asset,
                quantity: asset.quantity
            };
        });

        return assets;
    }

    async getAssetData(policyId, assetName) {
        return await fetch(this._getAssetDataEndpoint(policyId, assetName), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'project_id': this.projectId
            }
        }).then(response => {
            if (!response.ok) throw new Error('Asset data is unavailable for ' + policyId + '.' + assetName);

            return response.json();
        }).then(asset => {
            const metadata = asset.onchain_metadata;
            const hasIpfsImage = metadata.image && matadata.image.startsWith('ipfs://');
            const standardAsset = {
                id: asset.asset,
                policyId: asset.policy_id,
                assetName: convertFromHex(asset.asset_name),
                assetQuantity: parseInt(asset.quantity)
            };
            if (hasIpfsImage) standardAsset.ipfsImage = 'https://ipfs.blockfrost.dev/ipfs/' + metadata.image.substr(7);
            standardAsset.metadata = metadata;
            return standardAsset;
        });
    }

    async _getAllPages(endpoint) {
        const vals = [];
        // Bootstrap with dummy entry
        let pageVals = [{}];
        let page = 0;
        while (pageVals.length !== 0) {
            ++page;
            pageVals = await fetch(endpoint + '?page=' + page + '&count=100&order=desc', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'project_id': this.projectId
                }
            }).then(response => {
                if (!response.ok) throw new Error('Blockfrost endpoint rejected request to ' + endpoint);

                return response.json();
            }).then(responseVals => {
                if (!Array.isArray(responseVals)) throw new Error('Page values requested for non-array response: ' + endpoint);
                return responseVals;
            });
            vals.push(...pageVals);
        }
        return vals;
    }

    _getAssetOwnersEndpoint(policyId, assetName, page) {
        return this.baseUrl + '/assets/' + policyId + convertToHex(assetName) + '/addresses';
    }

    _getOwnedAssetsEndpoint(stakeAddr) {
        return this.baseUrl + '/accounts/' + stakeAddr + '/addresses/assets';
    }

    _getAssetsForPolicyEndpoint(policyId, page) {
        return this.baseUrl + '/assets/policy/' + policyId;
    }

    _getAssetDataEndpoint(policyId, assetName) {
        return this.baseUrl + '/assets/' + policyId + convertToHex(assetName);
    }

    _getAddressDataEndpoint(address) {
        return this.baseUrl + '/addresses/' + address;
    }
}

module.exports = BlockfrostClient;
