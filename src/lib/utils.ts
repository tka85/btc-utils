import assert = require('assert');
import convertExtendedKey from '../convertXpub';
import bip32 = require('bip32');
import bitcoinjs = require('bitcoinjs-lib');

export const MAINNET_XPRV_PREFIXES = ['xprv', 'yprv', 'Yprv', 'zprv', 'Zprv'];
export const MAINNET_XPUB_PREFIXES = ['xpub', 'ypub', 'Ypub', 'zpub', 'Zpub'];
export const TESTNET_XPRV_PREFIXES = ['tprv', 'uprv', 'Uprv', 'vprv', 'Vprv'];
export const TESTNET_XPUB_PREFIXES = ['tpub', 'upub', 'Upub', 'vpub', 'Vpub'];

/**
 * Converts an extended key into corresponding format bitcoinjs-lib can understand;
 * bitcoinjs-lib only understands xprv, xpub, tprv and tpub
 */
export function normalizeExtKey(extKey) {
    const conversions = {
        xprv: 'xprv',
        yprv: 'xprv',
        Yprv: 'xprv',
        zprv: 'xprv',
        Zprv: 'xprv',
        xpub: 'xpub',
        ypub: 'xpub',
        Ypub: 'xpub',
        zpub: 'xpub',
        Zpub: 'xpub',
        tprv: 'tprv',
        uprv: 'tprv',
        Uprv: 'tprv',
        vprv: 'tprv',
        Vprv: 'tprv',
        tpub: 'tpub',
        upub: 'tpub',
        Upub: 'tpub',
        vpub: 'tpub',
        Vpub: 'tpub',
    };
    const extKeyPrefix = extKey.slice(0, 4);
    const destFormat = conversions[extKeyPrefix];
    assert(destFormat, `Do not know how to convert ext key with prefix "${extKeyPrefix}"`);
    return convertExtendedKey({ sourceKey: extKey, destFormat });
}

/**
 * Evaluate legacy address from HD node
 */
export function getP2PKH(from: bip32.BIP32Interface | bitcoinjs.ECPairInterface, network: bitcoinjs.Network = bitcoinjs.networks.bitcoin): string {
    return bitcoinjs.payments.p2pkh({ pubkey: from.publicKey, network }).address;
}

/**
 * Evaluate p2sh wrapped segwit address from HD node
 */
export function getP2SHP2WPKH(from: bip32.BIP32Interface | bitcoinjs.ECPairInterface, network: bitcoinjs.Network = bitcoinjs.networks.bitcoin): string {
    return bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2wpkh({ pubkey: from.publicKey, network })
    }).address;
}

/**
 * Evaluate native segwit (bech32) address from HD node
 */
export function getP2WPKH(from: bip32.BIP32Interface | bitcoinjs.ECPairInterface, network: bitcoinjs.Network = bitcoinjs.networks.bitcoin): string {
    return bitcoinjs.payments.p2wpkh({ pubkey: from.publicKey, network }).address;
}

/**
 * Checks if extensible key is from mainnet based on prefix
 */
export function isMainnetXpubKey(extKey: string): boolean {
    return MAINNET_XPRV_PREFIXES.includes(extKey.slice(0, 4)) || MAINNET_XPUB_PREFIXES.includes(extKey.slice(0, 4));
}

/**
 * Checks if extensible key is from testnet based on prefix
 */
export function isTestnetXpubKey(extKey: string): boolean {
    return TESTNET_XPRV_PREFIXES.includes(extKey.slice(0, 4)) || TESTNET_XPUB_PREFIXES.includes(extKey.slice(0, 4));
}


/**
 * Get the bitcoinjs network object for given param 'mainnet' or 'testnet'
 */
export function fetchNetwork(network: string): bitcoinjs.Network {
    switch (network) {
        case 'mainnet':
            return bitcoinjs.networks.bitcoin;
            break;
        case 'testnet':
            return bitcoinjs.networks.testnet;
            break;
        default:
            throw new Error(`Invalid network specified: "${network}"; expected "mainnet" or "testnet"`);
    }
}