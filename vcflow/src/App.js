import React, { useState } from 'react';
import SignMessage from './SignMessage';
import VerifyMessage from './VerifyMessage';
import GenerateProof from './GenerateProof';
import DIDPlatform from './DIDPlatform';

//import GenerateVerifiableCred from './GenerateVerifiableCred';

//Roadmap
//  4. Be able to upload the VC into VerifyMessage and get output
//  5. Implement docloader to check context?

function LandingPage({ onOptionSelect }) {
  return (
    <div className="container mx-auto h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <button onClick={() => onOptionSelect('didRegistry')} className="py-4 px-8 bg-blue-500 text-white rounded-lg mb-2">DID Registry</button>
        <button onClick={() => onOptionSelect('issue')} className="py-4 px-8 bg-blue-500 text-white rounded-lg mb-2">Issue</button>
        <button onClick={() => onOptionSelect('generateProof')} className="py-4 px-8 bg-blue-500 text-white rounded-lg mb-2">Generate Proof</button>
        <button onClick={() => onOptionSelect('verify')} className="py-4 px-8 bg-blue-500 text-white rounded-lg mb-2">Verify</button> 
      </div>
    </div>
  );
}


function App() {
  const [selectedOption, setSelectedOption] = useState(null);

  function handleOptionSelect(option) {
    setSelectedOption(option);
  }

  function renderPage() {
    switch (selectedOption) {
      case 'didRegistry': // Add this case
        return <DIDPlatform />;
      case 'issue':
        return <SignMessage />;
      case 'generateProof':
        return <GenerateProof />;
      case 'verify':
        return <VerifyMessage />;
      default:
        return (
          <div>
            <h1 className="text-3xl font-bold text-blue-500 text-center mb-6">
              Veritus Labs
            </h1>
          <LandingPage onOptionSelect={handleOptionSelect} />
          </div>
          );
    }
  }
  return(
    <div className="container mx-auto">
      {renderPage()}
      {selectedOption && (
        <button 
          className='py-2 px-4 bg-green-500 text-white rounded-lg absolute bottom-0 left-0 mb-6 ml-6'
          style={{ position: 'fixed'}}
          onClick={() => setSelectedOption(null)}>
            Return Home
        </button>
      )}
    </div>
  )
  // return (
  //   <div className="container mx-auto bg-green-50 rounded-lg shadow-lg border border-green-300 p-8 m-10 flex flex-wrap">
  //     <div className="w-full lg:w-1/2">
  //       <SignMessage />
  //     </div>
  //     <div className="w-full lg:w-1/2">
  //       <VerifyMessage />
  //     </div>
  //   </div>
  // );
}

export default App;
