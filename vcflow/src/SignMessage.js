import { useState, useRef } from "react";
const ethers = require("ethers")

// async function that signs the message and returns the signers information for further use 
const signMessage = async ({ message }) => {
    try {
        console.log({message}); //testing purposes remove for prod
        if (!window.ethereum) {
            throw new Error("Metamask cannot be found");
        }
        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signature = await signer.signMessage(message);
        const address = await signer.getAddress();
        
        return {
            message,
            signature,
            address
        };
    }
    catch(err) {
        Error("Caught error");
    }
};

// exportable signing function for the main App.js 
export default function SignMessage() {
    // react hook that ties to the textarea elements for the signature and the proof
    const resultBox = useRef();
    // state that stores the signature information 
    const [signatures, setSignatures] = useState([]);

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
          // save contents of the file
          /**
           * @todo THIS SEEMS TO SAVE THE RESULT WITH THE SPACING FORMATTING...SHOULD WE JUST HAVE IT SIGN THE RAW STRING WITH NO SPACING?
           */
          const message = JSON.stringify(JSON.parse(e.target.result), 0);
          console.log(typeof message)               
          console.log(message); // testing remove for prod
          const sig = await signMessage({ message });
          if (sig) {
            const signedMessage = {
              ...JSON.parse(message),
              proof: {
                type: "EcdsaSecp256k1RecoverySignature2020",
                created: new Date().toISOString(),
                proofPurpose: "assertionMethod",
                verificationMethod: sig.address,
                jws: sig.signature,
              },
            };
            const signedMessageJSON = JSON.stringify(signedMessage, null, 2);
            const blob = new Blob([signedMessageJSON], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "signed.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link)
            setSignatures([...signatures, sig])
          }
        }
    };

    return (
      <form className="m-4" onSubmit={handleSign}>  
        <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
          <main className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Sign messages
            </h1>
            <div className="">
              <div className="my-3">
                <label htmlFor="fileInput" className="text-m font-semibold text-gray-700">
                  Select a JSON file to sign
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
              Sign message
            </button>
          </footer>
          {signatures.length > 0 &&
          <div className="p-2" key={signatures[signatures.length - 1].signature}>
            <div className="my-3">
              <p>
                {/* Message: {signatures[signatures.length - 1].message}  */}
              </p>
              <p>Signer: {signatures[signatures.length - 1].address}</p>
              <p>Signature: </p>
              <textarea
                type="text"
                readOnly
                ref={resultBox}
                className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                placeholder="Generated signature"
                value={signatures[signatures.length - 1].signature}
              />
              <p>W3C proof format: </p>
              <textarea
                type="text"
                readOnly
                ref={resultBox}
                className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                placeholder="W3C Proof"
                value={`
                "proof": {
                    "type": "EcdsaSecp256k1RecoverySignature2020",
                    "created": "${new Date().toISOString()}",
                    "proofPurpose": "assertionMethod",
                    "verificationMethod": "${signatures[signatures.length - 1].address}",
                    "jws": "${signatures[signatures.length - 1].signature}"
                  }`
                }
              />
              <a
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify({
                    proof: {
                      type: "EcdsaSecp256k1RecoverySignature2020",
                      created: new Date().toISOString(),
                      proofPurpose: "assertionMethod",
                      verificationMethod:
                        signatures[signatures.length - 1].address,
                      jws: signatures[signatures.length - 1].signature,
                    },
                  })
                )}`}
              download="signed_message.json"
            >
              <button className="btn btn-primary submit-button focus:ring focus:outline-none w-full mt-3">
                Download JSON
              </button>
            </a>
            </div>
          </div>
        }
        </div>
      </form>
    );
  }