const createCardanoUtils = require('../index.js');

const projectId = '';
const testnet = false;

const cardanoUtils = createCardanoUtils(projectId, testnet);

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

function testExtractBech32() {
    try {
        cardanoUtils.extractBech32('');
        throw new Error('Extraction should fail');
    } catch(err) {}

    try {
        cardanoUtils.extractBech32('addr1fsdfasfd');
        throw new Error('Extraction should fail');
    } catch(err) {}

    try {
        cardanoUtils.extractBech32('arewjklf;sf');
        throw new Error('Extraction should fail');
    } catch(err) {}

    if (testnet) {
        try {
            cardanoUtils.extractBech32('addr1q9qdsyy3leg336a9esvvkaha9uudlg9ndxhd4sywqs9jus64e4wsh29mr0xn7cl0uyvj6z8l5wr6w05xquym3wnmkrkslye9za');
            throw new Error('Extraction should fail');
        } catch(err) {}

        cardanoUtils.extractBech32('addr_test1qpqdsyy3leg336a9esvvkaha9uudlg9ndxhd4sywqs9jus64e4wsh29mr0xn7cl0uyvj6z8l5wr6w05xquym3wnmkrksujy9wz');
    } else {
        try {
            cardanoUtils.extractBech32('addr_test1qpqdsyy3leg336a9esvvkaha9uudlg9ndxhd4sywqs9jus64e4wsh29mr0xn7cl0uyvj6z8l5wr6w05xquym3wnmkrksujy9wz');
            throw new Error('Extraction should fail');
        } catch(err) {}
        cardanoUtils.extractBech32('addr1q9qdsyy3leg336a9esvvkaha9uudlg9ndxhd4sywqs9jus64e4wsh29mr0xn7cl0uyvj6z8l5wr6w05xquym3wnmkrkslye9za');
        if (!cardanoUtils.extractBech32('addr1v9k50ml6cgu6vlgwwfa33567ntwv4a52xp3mcww90fjdfeccu0p9p')) throw new Error('failed');
    }
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
testExtractBech32();

