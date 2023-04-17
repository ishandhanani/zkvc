import React, { useState } from 'react';
import { ethers } from 'ethers';
import SignMessage from './SignMessage';
import VerifyMessage from './VerifyMessage';
//import GenerateVerifiableCred from './GenerateVerifiableCred';

//Roadmap
//  1. Instead of a message input, upload a JSON-LD file (SignMessage)

const handleFileUpload = async (file) => {
  console.log(1)
  const fileReader = new FileReader();
  console.log(2)
  fileReader.onload = async (e) => {
    console.log(3)
    const data = JSON.parse(e.target.result);
    console.log(3)
    const message = Object.values(data)[0];
    console.log(4)
    console.log(message);
  }
}



//  2. Go through the flow and generate a VC-style proof (SignMessage)
//  3. Download the complete JSON-LD signed VC (App.js)
//  4. Be able to upload the VC into VerifyMessage and get output
//  5. Implement docloader to check context?


//Question - generating the signature


function App() {
  return (
    <div className="container mx-auto bg-green-50 rounded-lg shadow-lg border border-green-300 p-8 m-10 flex flex-wrap">
      <div className="w-full lg:w-1/2">
        <SignMessage />
      </div>
      <div className="w-full lg:w-1/2">
        <VerifyMessage />
      </div>
    </div>
  );
}

export default App;
