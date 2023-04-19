import { useState, useRef } from "react";
const ethers = require("ethers")

const verifyMessage = async ({ message, address, signature }) => {
    try {
      const signerAddr = await ethers.utils.verifyMessage(message, signature);
      if (signerAddr !== address) {
        return false;
      }
  
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
};

export default function VerifyMessage() {
    //display if signature is valid or not
    const [isValidSignature, setIsValidSignature] = useState("");

    const handleVerification = async (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const file = data.get("signedvc");
      const fileContent = await file.text();
      const json = JSON.parse(fileContent);
      const m = JSON.stringify(json, null).split(',"proof":')[0] + '}';
      console.log(m);
      const sig = json.proof.jws;
      const addr = json.proof.verificationMethod
      
      const isValid = await verifyMessage({
        message: m,
        address: addr,
        signature: sig
      });
  
      if (isValid) {
        console.log("Signature is valid!");
        setIsValidSignature("valid")
      } else {
        console.log("Invalid signature");
        setIsValidSignature("invalid")
      }
    }

return (
    <form className="m-4" onSubmit={handleVerification}>
      <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Verify signature
          </h1>
          <div className="">
            <div className="my-3">
              <input  
                required
                type="file"
                name="signedvc"
                className="input input-bordered focus:ring focus:outline-none"/>
              {/* <textarea
                required
                type="text"
                name="message"
                className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                placeholder="Message"
              /> */}
            </div>
            {/* <div className="my-3">
              <textarea
                required
                type="text"
                name="signature"
                className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                placeholder="Signature"
              />
            </div>
            <div className="my-3">
              <input
                required
                type="text"
                name="address"
                className="textarea w-full input input-bordered focus:ring focus:outline-none"
                placeholder="Signer address"
              />
            </div> */}
          </div>
        </main>
        <footer className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
            Verify signature
          </button>
        </footer>
        <div className="p-4 mt-4 bg-gray-100 rounded-lg shadow-md">
        {isValidSignature === "" ? (
            <p></p>
          ) : isValidSignature === "valid" ? (
            <p className="text-green-500">Signature is valid!</p>
          ) : (
            <p className="text-red-500">Invalid signature</p>
          )}
        </div>
      </div>
    </form>
  );
}