const shelleyGenesisTimestamp = 1596491091;
const shelleyGenesisSlot = 4924800;

// Only able to look back to 10/20/2021, not sure when the genesis block was
const shelleyTestnetArbitraryTimestamp = 1634742062;
const shelleyTestnetArbitrarySlot = 40372846;

export function stringToHex(str) {
    let hexStr = '';
    for (let i = 0; i < str.length; i++) {
        const hex = Number(str.charCodeAt(i)).toString(16);
        hexStr += hex;
    }
    return hexStr;
}

export function stringFromHex(hexData) {
    const hex = hexData.toString();
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

export function getSlot(timestamp, testnet) {
    if (!timestamp) timestamp = Math.round((new Date()).getTime() / 1000);
    if (testnet) return (timestamp - shelleyTestnetArbitraryTimestamp) + shelleyTestnetArbitrarySlot;
    return (timestamp - shelleyGenesisTimestamp) + shelleyGenesisSlot;
}
