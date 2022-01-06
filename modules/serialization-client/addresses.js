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
};

// Stateless
module.exports = new AddressHelper();



