const createCardanoUtils = require('../index.js');

const projectId = '';

const cardanoUtils = createCardanoUtils(projectId, false);

function testValidateSignedMessage() {

}

function testGetStakeAddress() {
    let stakeAddr = cardanoUtils.getStakeAddress(
        'addr1q8jackcnq8uzgkh9cxex28hean40qtf2xjwpsj3hc2trhgz4e4wsh29mr0xn7cl0uyvj6z8l5wr6w05xquym3wnmkrks3z57w6'
    );

    if (stakeAddr !== 'stake1u92u6hgt4za3hnflv0h7zxfdprl68pa886rqwzdchfampmgy03sqj')
        throw new Error('Stake address conversion failed');

    stakeAddr = cardanoUtils.getStakeAddress('stake1u92u6hgt4za3hnflv0h7zxfdprl68pa886rqwzdchfampmgy03sqj');
    if (stakeAddr !== 'stake1u92u6hgt4za3hnflv0h7zxfdprl68pa886rqwzdchfampmgy03sqj')
        throw new Error('Stake address did not remain unchanged');

    stakeAddr = cardanoUtils.getStakeAddress('addrfdsafsdf');
    if (stakeAddr) throw new Error('Stake address conversion didn\'t fail with invalid address');
}

function testConvertToHex() {
    // TODO
}

function testConvertFromHex() {
    // TODO
}

function testGetSlot() {
    // TODO
}

async function testGetNFTAssetOwner() {
    const owner = await cardanoUtils.getNFTAssetOwner(
        'b81e5ffa08dbd35bf7ac7f9d7f0f58d3581444510b35ea4d098313b5', 'CryptoPet198'
    );

    if (!owner || !owner.startsWith('addr')) throw new Error('Failed to obtain asset owner');
}

function testGetAssetOwners() {
    // TODO
}




function testGetOwnedAssets() {
    // TODO
}

async function testGetPolicyAssets() {
    const assets = await cardanoUtils.getPolicyAssets('b81e5ffa08dbd35bf7ac7f9d7f0f58d3581444510b35ea4d098313b5');
    if (!assets || assets.length !== 10000) throw new Error('Invalid asset count for CryptoPetz. Only ' + assets.length + ' found');
}

function testGetAssetData() {
    // TODO
}

testValidateSignedMessage();
testGetStakeAddress();
testConvertToHex();
testConvertFromHex();
testGetSlot();
testGetNFTAssetOwner();
testGetAssetOwners();
testGetOwnedAssets();
testGetPolicyAssets();
testGetAssetData();

