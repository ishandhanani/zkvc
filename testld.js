const jsonld = require('jsonld');

const contextURL = "https://w3id.org/vdl/v1"
const context = jsonld.documentLoaders.node().load(contextURL)
console.log(contextURL)