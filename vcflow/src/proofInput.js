import { signAsync, ProjectivePoint, recover, Signature } from '@noble/secp256k1';
import { Buffer } from 'buffer'
import pkg from 'js-sha3';
const { keccak256 } = pkg;

function bigint_to_tuple(x) {
    let mod = 2n ** 64n;
    let ret = [0n, 0n, 0n, 0n];

    var x_temp = x;
    for (var idx = 0; idx < ret.length; idx++) {
        ret[idx] = x_temp % mod;
        x_temp = x_temp / mod;
    }
    return ret;
}

function Uint8ArrayToBigint(x) {
    var ret = 0n;
    for (var idx = 0; idx < x.length; idx++) {
        ret = ret * 256n;
        ret = ret + BigInt(x[idx]);
    }
    return ret;
}

// function outputToJson(obj, path){
//     const jsonData = JSON.stringify(obj, null, 2);
//     fs.writeFileSync(path, jsonData);
// }

// function verifiableCredentialToMessage(path) {
//     const data = fs.readFileSync(path, 'utf-8')
//     let vc = JSON.parse(data)
//     vc = JSON.stringify(vc)
//     const message = "\x19Ethereum Signed Message:\n" + vc.length.toString() + vc;
//     return message
// }

function utf8ToUint8Array(string) {
    return Uint8Array.from(Buffer.from(string, 'utf-8'))
}

// Bits are encoded in little-endian format 
function bytesToBits(b) {
    const bits = [];
    for (let i = 0; i < b.length; i++) {
        for (let j = 0; j < 8; j++) {
            if ((Number(b[i])&(1<<j)) > 0) {
                // bits.push(Fr.e(1));
                bits.push(1);
            } else {
                // bits.push(Fr.e(0));
                bits.push(0);
            }
        }
    }
    return bits
}

async function getSignature(messageHashHex, privateKeyHex){
    const signature = await signAsync(messageHashHex, privateKeyHex)
    const hexR = signature.r.toString(16).padStart(32, "0")
    const hexS = signature.s.toString(16).padStart(32, "0")
    const hexV = (signature.recovery + 27).toString(16)
    console.log(hexR, hexS, hexV)
    return signature
}

function privatekeyToPublickey(privateKeyHex) {
    const privateKeyBigInt = Uint8ArrayToBigint(Uint8Array.from(Buffer.from(privateKeyHex, 'hex')))
    return ProjectivePoint.fromPrivateKey(privateKeyBigInt)
}

async function createTestCase(message, signature, pubkey) {
    const beforeAddress = message.substring(0,46)
    const address = message.substring(46,86)
    const betweenAddressBirthdate = message.substring(86,102)
    const birthdate = message.substring(102, 112)
    const afterBirthdate = message.substring(112, 114)

    const beforeAddressUint8 = utf8ToUint8Array(beforeAddress)
    const addressUint8 = utf8ToUint8Array(address)
    const betweenAddressBirthdateUint8 = utf8ToUint8Array(betweenAddressBirthdate)
    const birthdateUint8 = utf8ToUint8Array(birthdate)
    const afterBirthdateUint8 = utf8ToUint8Array(afterBirthdate)
    const messageUint8Array = utf8ToUint8Array(message)

    const beforeAddressBits = bytesToBits(beforeAddressUint8)
    const addressBits = bytesToBits(addressUint8)
    const betweenAddressBirthdateBits = bytesToBits(betweenAddressBirthdateUint8)
    const birthdateBits = bytesToBits(birthdateUint8)
    const afterBirthdateBits = bytesToBits(afterBirthdateUint8)
    
    const messageHashHex = keccak256.create().update(messageUint8Array).hex()

    
    const rBigIntTuple = bigint_to_tuple(signature.r)
    const sBigIntTuple = bigint_to_tuple(signature.s)

    const xBigIntTuple = bigint_to_tuple(pubkey.x)
    const yBigIntTuple = bigint_to_tuple(pubkey.y)

    const obj = {
        year21: "2002",
        month21: "5",
        day21: "4",
        before: beforeAddressBits,
        address: addressBits,
        between: betweenAddressBirthdateBits,
        birthdate: birthdateBits,
        after: afterBirthdateBits,
        r: rBigIntTuple.map(b => b.toString()),
        s: sBigIntTuple.map(b => b.toString()),
        pubkey: [xBigIntTuple.map(b => b.toString()), yBigIntTuple.map(b => b.toString())]
    }

    return obj
}

function convertSignature(sig) {
    let signature = Signature.fromCompact(sig.substring(2,130))
    const recoveryId = parseInt(sig.substring(130,132), 16) - 27;
    signature = signature.addRecoveryBit(recoveryId)
    return signature
}

function getMsghash(msg) {
    return keccak256.create().update(msg).hex()
}

function getAddressFromPubkey(pubkey) {
    return keccak256.create().update(pubkey.toRawBytes(false).slice(1,66)).hex().slice(24,65)
}

export { createTestCase, getMsghash, getAddressFromPubkey, convertSignature }