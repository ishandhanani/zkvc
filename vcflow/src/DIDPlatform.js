import React, { useState } from 'react';
import classNames from 'classnames';

//our offerings 
const options = [
    {
        id: "option1",
        title: 'Quick Setup',
        description: "Quickly set up your company's identity management platform with our hassle-free onboarding onto ETHR-DID, \
        the widely-used decentralized identity registry that leverages the Ethereum blockchain. Easily manage decentralized identifiers \
        and verifiable credentials on a decentralized platform, giving your customers full control over their identities, while ensuring your \
        company can easily verify and authenticate identities while maintaining privacy and security. Ideal for companies seeking a reliable, \
        secure, and interoperable identity solution without the complexities of customizing their own registry.",
        link: '/option1',
        color: 'blue',
    },
    {
        id: "option2",
        title: 'Custom Registory',
        description: "Customize your own decentralized identity registry based on existing platforms like ETHR-DID. \
        Ideal for flexible identity management solutions without building from scratch. Customize access control, credential schemas,\
        and more. Seamlessly integrate with existing decentralized identity systems and maintain complete control over your identity\
        management solution while benefiting from established interoperability and security.",
        link: '/option2',
        color: 'green',
    },
    {
        id: "option3",
        title: 'Enterprise Solution',
        description: 'Our Enterprise Solution provides comprehensive customization options to help you create an identity solution \
        tailored to your specific needs. With our platform, you can fine-tune every aspect of your identity solution to ensure seamless \
        integration with your existing systems and maintain complete control over your data. Whether you need a centralized or \
        decentralized solution, our Enterprise Solution can help you build a reliable, secure, and interoperable identity platform \
        that meets your organization\'s unique requirements.',
        link: '/option3',
        color: 'purple',
    },
];

export default function LandingPage() {
    const [selectedOption, setSelectedOption] = useState(null);
    
    const handleOptionClick = (optionId) => {
        setSelectedOption(optionId);
    };

    const handleBackClick = () => {
        setSelectedOption(null);
    };    

    const renderSelectedOption = () => {
        switch (selectedOption) {
          case 'option1':
            return (
              <div>
                <h2>Quick Setup</h2>
                {
                    <form className="w-full max-w-lg">
                        <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="company-name">
                            Company Name
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="company-name" type="text" placeholder="Enter company name" />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                            Email Address
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder="Enter email address" />
                        </div>
                        </div>
                    </form>
                }
                <button onClick={() => handleBackClick()} className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Back to Main Page
                </button>
              </div>
            );
          case 'option2':
            return (
              <div>
                <h2>Custom Registry</h2>
                {
                    <form className="w-full max-w-lg">
                    <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="company-name">
                        Company Name
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="company-name" type="text" placeholder="Enter company name" />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                        Email Address
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder="Enter email address" />
                    </div>
                    </div>
                </form>
                }
                <button onClick={() => handleBackClick()} className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Back to Main Page
                </button>
              </div>
            );
          case 'option3':
            return (
              <div>
                <h2>Complete Customization</h2>
                {
                    <form className="w-full max-w-lg">
                    <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="company-name">
                        Company Name
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="company-name" type="text" placeholder="Enter company name" />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                        Email Address
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder="Enter email address" />
                    </div>
                    </div>
                </form>
                }
                <button onClick={() => handleBackClick()} className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Back to Main Page
                </button>
              </div>
            );
          default:
            return (
              <div className="grid grid-cols-3 gap-4">
                {options.map((option) => (
                  <div
                    key={option.id}
                    className={classNames(
                      'bg-white rounded-lg p-6 text-center transition-all duration-300 hover:shadow-md',
                      {
                        'border-blue-600': option.id === 'option1',
                        'border-green-600': option.id === 'option2',
                        'border-purple-600': option.id === 'option3',
                      }
                    )}
                    onClick={() => handleOptionClick(option.id)}
                  >
                    <h2 className="text-2xl font-bold mb-2">{option.title}</h2>
                    <p className="text-gray-700 text-left">{option.description}</p>
                  </div>
                ))}
              </div>
            );
        }
      };
    
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">
                Identity and Credential Management Simplified
            </h1>
            {renderSelectedOption()}
        </div>
    );
};