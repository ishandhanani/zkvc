import { useState, useRef } from "react";
const ethers = require("ethers")

const signMessage = async ({ message }) => {
    try {
        console.log({message});
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

export default function SignMessage() {
    const resultBox = useRef();
    const [signatures, setSignatures] = useState([]);

    const handleSign = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const sig = await signMessage({
            message: data.get("message")
        });
        if (sig) {
            setSignatures([...signatures, sig])
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
                <textarea
                  required
                  type="text"
                  name="message"
                  className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                  placeholder="Message"
                />
              </div>
            </div>
          </main>
          <footer className="p-4">
            <button
              type="submit"
              className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            >
              Sign message
            </button>
          </footer>
          {signatures.length > 0 &&
          <div className="p-2" key={signatures[signatures.length - 1].signature}>
            <div className="my-3">
              <p>
                Message: {signatures[signatures.length - 1].message}
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
            </div>
          </div>
        }
        </div>
      </form>
    );
    }