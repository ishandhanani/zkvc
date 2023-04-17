const { ethers } = require('ethers');
const jsonldObject = require('./inputDocument.json')

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Convert the JSON-LD object to a string and hash it
const jsonString = JSON.stringify(jsonldObject);
const jsonHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(jsonString));
