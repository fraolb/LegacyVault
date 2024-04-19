import { useState, useEffect } from "react";
import { newKit } from "@celo/contractkit";
import MultiSendABI from "../../ContractABI/MultiSendABI.json";
import {
  type BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ethers } from "ethers";
import { parseEther } from "viem";

const MultiSend = () => {
  const [addresses, setAddresses] = useState<string[]>([""]);
  const [amount, setAmount] = useState<string>("");
  const { address, isConnected } = useAccount();
  const [userAddress, setUserAddress] = useState<string>("");

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const MultiSendContract = "0x89BE7812ff29020a5Fa31b9a0ccf17A37D9B90F9";

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  const handleAddAddress = () => {
    setAddresses([...addresses, ""]);
  };

  const handleAddressChange = (index: number, value: string) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = value;
    setAddresses(updatedAddresses);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleDeleteAddress = (index: number) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    setAddresses(updatedAddresses);
  };

  const handleSend = async () => {
    const amountToSend = Number(amount) * addresses.length;
    writeContract({
      address: MultiSendContract,
      abi: MultiSendABI,
      functionName: "multiSend",
      args: [addresses],
      value: parseEther(`${amountToSend}`),
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div className="container p-4 sm:p-6  ">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Multi - Sender
      </h1>
      <form className="space-y-6">
        <div className="flex align-middle">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-white flex items-center pr-2"
          >
            Amount (CELO)
          </label>

          <input
            id="amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="mt-1 text-black focus:ring-blue-500 w-3/4 focus:border-blue-500 block shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-2 border"
          />
        </div>
        <div className="text-l font-semibold text-center text-white">
          Receiver Addresses
        </div>
        <div className="overflow-auto max-h-48">
          {" "}
          {/* Adjust max-h-48 to your desired maximum height */}
          {addresses.map((address, index) => (
            <div key={index} className="rounded-md mb-4 flex items-center">
              <input
                id={`address-${index}`}
                type="text"
                value={address}
                placeholder={`address ${index + 1}`}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                className="flex-1 focus:ring-mainLight text-black w-full focus:border-mainLight block shadow-sm sm:text-sm border-mainLight rounded-md px-4 py-2 border-t-0"
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
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddAddress}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Address
          </button>
        </div>
        <div className="w-full flex flex-wrap">
          {/* {hash && (
            <div className="break-words">
              Transaction Hash: <div className="w-1/2">{hash}</div>
            </div>
          )} */}
          {isConfirming && (
            <div className="w-full">Waiting for confirmation...</div>
          )}
          {isConfirmed && <div className="w-full">Transaction confirmed.</div>}
          {error && (
            <div className="w-full">
              Error: {(error as BaseError).shortMessage || error.message}
            </div>
          )}
          {addresses.length == 0 ? (
            <div className="w-full">Add Receiver Address!</div>
          ) : null}
        </div>
        <div className="fixed bottom-16 left-0 right-0  p-4 sm:p-6 ">
          <button
            type="button"
            onClick={handleSend}
            disabled={isPending}
            className="inline-flex w-full text-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {isPending ? "Confirming..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiSend;
