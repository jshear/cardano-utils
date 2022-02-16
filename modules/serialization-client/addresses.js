const { Address, Ed25519Signature, PublicKey, BaseAddress, RewardAddress, StakeCredential } = require('@emurgo/cardano-serialization-lib-nodejs');
const { Buffer } = require('buffer');

class AddressHelper {

    getStakeAddress(address) {
        if (address.startsWith('stake')) return address;
        if (!address.startsWith('addr')) throw new Error('Invalid address');
        
        // Build base address
        const addr = Address.from_bech32(address);
        const baseAddr = BaseAddress.from_address(addr);

        // Extract stake credential               
        const stakeCred = baseAddr.stake_cred();

        // Build reward address (add 0xe1 prefix to 28 last bytes of stake credential one)
        let rewardAddrBytes = new Uint8Array(29);
        rewardAddrBytes.set([0xe1], 0);
        rewardAddrBytes.set(stakeCred.to_bytes().slice(4, 32), 1);
        const rewardAddr = RewardAddress.from_address(Address.from_bytes(rewardAddrBytes));

        const stakeAddr = rewardAddr.to_address().to_bech32();
        return stakeAddr;
    }

    extractBech32(address, testnet) {
        const sep = address.lastIndexOf('1');
        if (sep < 0) throw new Error('Invalid Bech32 address');
        const prefix = address.slice(0, sep);
        const data = address.slice(sep);

        // For now, just validate payment address -- the intent of this method is to validate bech32 and
        // divide a Cardano address into its parts (prefix, network, header type, payment part, delegation part)
        if (prefix !== 'addr' + (testnet ? '_test' : '')) throw new Error('Invalid output address');
        const addr = Address.from_bech32(address);
        const baseAddr = BaseAddress.from_address(addr);
        if (!baseAddr) throw new Error('No base address found');
    }
};

// Stateless
module.exports = new AddressHelper();



