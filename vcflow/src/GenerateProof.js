import { createTestCase, getMsghash, getAddressFromPubkey, convertSignature } from './proofInput.js'

function createMessage(obj) {
  const objCopy = { ...obj }
  delete objCopy.proof;
  const message = JSON.stringify(objCopy,0)
  return "\x19Ethereum Signed Message:\n" + message.length.toString() + message;
}

export default function GenerateProof() {
  const snarkjs = window.snarkjs
  // async function that handles submission and signing
  const handleSign = async (e) => {
    e.preventDefault();
    // get the file contents
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    // this reads the actual file
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (e) => {
      const obj = JSON.parse(e.target.result)
      const message = createMessage(obj)

      const jwsSplit = obj.proof.jws.split('.')
      const signatureHex = atob(jwsSplit[2])
      const signature = convertSignature(signatureHex)
      const msghash = getMsghash(message)
      const pubkey = signature.recoverPublicKey(msghash)
      const address = getAddressFromPubkey(pubkey)
      
      // TO DO: enforce that issue address in vc matches the one generated
      // from the signature.
      console.log(obj.proof.verificationMethod.substring(2,42).toLowerCase() == address)

      // TO DO: have 21 year old date generated based off time.now()
      const testCase = await createTestCase(message, signature, pubkey)
      console.log(testCase)

      // const testCase = { a: 10, b: 3 }

      console.log('Generating proof:')
      const { proof, publicSignals } =  await snarkjs.groth16.fullProve(testCase, 'keccak2.wasm', 'keccak2.zkey')
      // const { proof, publicSignals } =  await snarkjs.groth16.fullProve(testCase, 'test.wasm', 'test.zkey')
      console.log('Proof done generating.')
      console.log(proof, publicSignals)

      // const vkey = await fetch("test_vkey.json").then((res) => res.json());
      // const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);
      // console.log(res)
    }
  };

  return (
      <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Generate Zero Knowledge Proof
          </h1>
          <form className="m-4" onSubmit={handleSign}>  
          <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
            <main className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Generate Proof
              </h1>
              <div className="">
                <div className="my-3">
                  <label htmlFor="fileInput" className="text-m font-semibold text-gray-700">
                    Select a VC to generate proof from
                  </label>
                  <input
                    required
                    type="file"
                    id="fileInput"
                    accept=".json"
                    className="w-full h-10"
                  />
                </div>
              </div>
            </main>
            <footer className="p-4">
              <button
                type="submit"
                className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
                Generate Proof
              </button>
            </footer>
          </div>
        </form>
        </main>
      </div>
  );
}