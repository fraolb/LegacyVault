import { useState } from "react";

const Lock = () => {
  const [date, setDate] = useState<string>("");
  const [walletAddresses, setWalletAddresses] = useState<string[]>([""]);
  const [amount, setAmount] = useState<string>("");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleAddressChange = (index: number, value: string) => {
    const updatedAddresses = [...walletAddresses];
    updatedAddresses[index] = value;
    setWalletAddresses(updatedAddresses);
  };

  const handleAddAddress = () => {
    setWalletAddresses([...walletAddresses, ""]);
  };

  const handleDeleteAddress = (index: number) => {
    const updatedAddresses = [...walletAddresses];
    updatedAddresses.splice(index, 1);
    setWalletAddresses(updatedAddresses);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleSubmit = () => {
    // Handle form submission (e.g., send data to backend)
    console.log("Form submitted:", { date, walletAddresses, amount });
  };

  return (
    <div className="container p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Lock Your Tokens
      </h1>
      <form className="space-y-4">
        <div className="flex justify-between">
          <label
            htmlFor="amount"
            className="flex items-center text-sm font-medium w-1/4"
          >
            Amount (CELO)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            placeholder="Amount you want to lock!"
            onChange={handleAmountChange}
            className="mt-1 text-black w-3/4 focus:ring-blue-500 focus:border-blue-500 block shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div className="flex justify-between">
          <label
            htmlFor="date"
            className="text-sm font-medium flex items-center w-1/4"
          >
            Lock Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={handleDateChange}
            className="mt-1 w-3/4 text-black focus:ring-blue-500 focus:border-blue-500 block shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        <div>
          <label htmlFor="addresses" className="block text-sm font-medium">
            Wallet Addresses
          </label>
          <div className="max-h-40 overflow-y-auto rounded-md">
            {walletAddresses.map((address, index) => (
              <div key={index} className="rounded-md mb-4 flex items-center">
                <input
                  id={`address-${index}`}
                  type="text"
                  value={address}
                  onChange={(e) => handleAddressChange(index, e.target.value)}
                  className="mt-1 text-black focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-2"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteAddress(index)}
                  className="text-white ml-2 bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <svg
                    viewBox="0 0 924 1024"
                    width="15px"
                    height="20px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#ffffff"
                      d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddAddress}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Address
          </button>
        </div>

        <div className="fixed bottom-16 left-0 right-0  p-4 sm:p-6 ">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex w-full text-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Lock Tokens
          </button>
        </div>
      </form>
    </div>
  );
};

export default Lock;
