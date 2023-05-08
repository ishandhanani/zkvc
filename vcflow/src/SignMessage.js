import jwsheader from './jwsheader.json';
import { useState } from "react";
const ethers = require("ethers");

// async function that signs the message and returns the signers information for further use 
const signMessage = async ({ message }) => {
    try {
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

// function that generates a valid jws token for the proof
// btoa and atob are depractated. Ill change them later
const jwsGen = ({ content, signature }) => {
  const header = JSON.stringify(jwsheader);
  const jws = [btoa(header), btoa(content), btoa(signature)].join('.');
  return jws;
}


export default function SignMessage() {
    // state that stores the signature information 
    const [signatures, setSignatures] = useState([]);
    //state for registry
    const [registry, setRegistry] = useState('');
    //state for document type
    const [vctype, setVctype] = useState('');

    //async function that generates a JSON-LD 
    const generateJSON = async (e) => {
      e.preventDefault();
      const formInputs = document.querySelectorAll('form input[type="text"]');
      const formData = {}; //add the default JSOn stuf here
      formInputs.forEach(input => {
        formData[input.name] = input.value;
      });
      const jsonData = JSON.stringify(formData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'form-data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }


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
          // testing the bday signature only
          // const bm = JSON.parse(e.target.result);
          // const bday = JSON.stringify(bm.credentialSubject.license.birth_date);
          // console.log("bday=", bday)
          // const bsig = await signMessage({ message: bday });
          // console.log("test", bsig)
          // save contents of the file as a string with no spaces
          const message = JSON.stringify(JSON.parse(e.target.result), 0);
          const sig = await signMessage({ message });
          if (sig) {
            const signedMessage = {
              // the ... is basically an easy way to copy all the properties of message into a new object
              ...JSON.parse(message),
              proof: {
                type: "EcdsaSecp256k1RecoverySignature2020",
                created: Math.floor(new Date().getTime() / 1000), //UTC timestamp
                proofPurpose: "assertionMethod",
                verificationMethod: sig.address,
                jws: jwsGen({content: message, signature: sig.signature}),
              },
            };
            const signedMessageJSON = JSON.stringify(signedMessage, null, 2);
            // flow to download JSON - i dont understand it 100% at the moment but it works 
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



    
    //return
    return (
      <div className='container mt-5'>
        <h1 className='text-3xl font-bold text-blue-500 text-center mb-8'>
          Issue Credential
        </h1>
        <h2 className="text-lg font-semibold text-gray-500 mt-8 mb-4">DID platform:</h2>
        <div className="relative inline-block w-full text-gray-700">
          <select className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" defaultValue="" onChange={(e) => setRegistry(e.target.value)}>
            <option value="" disabled>Select a registry</option>
            <option value="eth-registry">Ethereum Registry</option>
            <option value="veritus-registry">Veritus Registry</option>
            <option value="hyperledger-registry">Hyperledger Registry</option>
          </select>
          {registry === "eth-registry" ? (
            <p className="text-lg font-medium text-gray-500 mt-4">
            Your DID is did:ethr:12345
            <br />
            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">View your DID document here</a>
          </p>          
          ) : registry === "veritus-registry" ? (
            <p className="text-lg font-medium text-gray-500 mt-4">
              Your DID is did:vrts:12345
              <br />
              <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">View your DID document here</a>
            </p> 
          ) : registry === "hyperledger-registry" ? (
            <p className="text-lg font-medium text-gray-500 mt-4">
              Your DID is did:hypr:12345
              <br />
              <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">View your DID document here</a>
            </p> 
          ) : null}      
        </div>    
        <div class="sign-options" className="mt-8 flex items-center justify-center">
                <button className="flex-1 py-4 px-8 bg-blue-500 text-white rounded-lg mb-2 mr-4" id="dl" onClick={() => setVctype('dl')}>Drivers License</button>
                <button className="flex-1 py-4 px-8 bg-blue-500 text-white rounded-lg mb-2 mr-4" id="vax" onClick={() => setVctype('vax')}>Vaccination Card</button>
                <button className="flex-1 py-4 px-8 bg-blue-500 text-white rounded-lg mb-2 mr-4" id="kyc" onClick={() => setVctype('kyc')}>KYC Token</button>
        </div>
        {vctype === 'dl' && (
          <form onSubmit={generateJSON}>
            <label htmlFor="dl-name" className="block text-lg font-medium text-gray-500 mt-4">
              Name
            </label>
            <input type="text" id="dl-name" name="dl-name" className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" />
            <label htmlFor="dl-license-no" className="block text-lg font-medium text-gray-500 mt-4">
              License Number
            </label>
            <input type="text" id="dl-license-no" name="dl-license-no" className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" />
            <label htmlFor="dl-issue-date" className="block text-lg font-medium text-gray-500 mt-4">
              Issue Date
            </label>
            <input type="text" id="dl-issue-date" name="dl-issue-date" className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" />
            <button className="py-4 px-8 bg-blue-500 text-white rounded-lg mt-4" type="submit">
              Submit
            </button>
          </form>
        )}
        {vctype === 'vax' && (
          <form onSubmit={generateJSON}>
            <label htmlFor="name" className="block text-lg font-medium text-gray-500 mt-4">
              Name
            </label>
            <input type="text" id="name" name="name" className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" />
            <label htmlFor="dob" className="block text-lg font-medium text-gray-500 mt-4">
              Date of Birth
            </label>
            <input type="date" id="dob" name="dob" className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" />
            <label htmlFor="vaxtype" className="block text-lg font-medium text-gray-500 mt-4">
              Vaccine Type
            </label>
            <select id="vaxtype" name="vaxtype" className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline">
              <option value="">Select a vaccine type</option>
              <option value="pfizer">Pfizer</option>
              <option value="moderna">Moderna</option>
              <option value="jj">Johnson & Johnson</option>
              <option value="astrazeneca">AstraZeneca</option>
            </select>
            <label htmlFor="vaxdate" className="block text-lg font-medium text-gray-500 mt-4">
              Date of Vaccination
            </label>
            <input type="date" id="vaxdate" name="vaxdate" className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" />
            <button className="py-4 px-8 bg-blue-500 text-white rounded-lg mt-4" type="submit">
              Submit
            </button>
          </form>
        )}
        {vctype === 'kyc' && (
          <form onSubmit={generateJSON}>
            <label htmlFor="name" className="block text-lg font-medium text-gray-500 mt-4">
              Full Name
            </label>
            <input type="text" id="name" name="name" className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" />

            <label htmlFor="dob" className="block text-lg font-medium text-gray-500 mt-4">
              Date of Birth
            </label>
            <input type="date" id="dob" name="dob" className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" />

            <label htmlFor="address" className="block text-lg font-medium text-gray-500 mt-4">
              Address
            </label>
            <input type="text" id="address" name="address" className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" />

            <label htmlFor="kyc-number" className="block text-lg font-medium text-gray-500 mt-4">
              KYC Token Number
            </label>
            <input type="text" id="kyc-number" name="kyc-number" className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" />

            <button className="py-4 px-8 bg-blue-500 text-white rounded-lg mt-4" type="submit">
              Submit
            </button>
          </form>
        )}
          
        

        <form className="m-4" onSubmit={handleSign}>  
          <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
            <main className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Issue Credential
              </h1>
              <div class="sign-options">
                <button className='bg-blue-500 text-white rounded-lg' id="dl">Drivers License</button>
                <button className='bg-blue-500 text-white rounded-lg' id="vax">Vaccination Card</button>
                <button className='bg-blue-500 text-white rounded-lg' id="kyc">KYC Token</button>
              </div>
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
                <p className='text-green-500 text-center'>This credential is signed!</p>
                <p className='text-green-500 text-center'>Signed by: {signatures[signatures.length - 1].address}</p>
                {/* <p>Signature: {signatures[signatures.length - 1].signature}</p>
                <textarea
                  type="text"
                  readOnly
                  ref={resultBox}
                  className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                  placeholder="Generated signature"
                  value={signatures[signatures.length - 1].signature}
                /> */}
                {/* <p>W3C proof format: </p>
                <textarea
                  type="text"
                  readOnly
                  ref={resultBox}
                  className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                  placeholder="W3C Proof"
                  value={`
                  "proof": {
                      "type": "EcdsaSecp256k1RecoverySignature2020",
                      "created": "${Math.floor(new Date().getTime() / 1000)}",
                      "proofPurpose": "assertionMethod",
                      "verificationMethod": "${signatures[signatures.length - 1].address}",
                      "jws": "${signatures[signatures.length - 1].signature}"
                    }`
                  }
                /> */}
                <a
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(new Date().toISOString())}`} //this is the link to the download. it used to hold the proof 
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
      </div>
    );
  }