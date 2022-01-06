const shelleyGenesisTimestamp = 1596491091;
const shelleyGenesisSlot = 4924800;

function convertToHex(str) {
    let hexStr = '';
    for (let i = 0; i < str.length; i++) {
        const hex = Number(str.charCodeAt(i)).toString(16);
        hexStr += hex;
    }
    return hexStr;
}

function convertFromHex(hexData) {
    const hex = hexData.toString();
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

function getSlot(timestamp) {
    if (!timestamp) timestamp = Math.round((new Date()).getTime() / 1000);
    return (timestamp - shelleyGenesisTimestamp) + shelleyGenesisSlot;
}

module.exports = {
    convertToHex: convertToHex,
    convertFromHex: convertFromHex,
    getSlot: getSlot
};