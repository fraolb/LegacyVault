import { useState, useEffect, useMemo } from "react";
import {
  type BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { readContract } from "@wagmi/core";
import LockABI from "../../ContractABI/LockABI.json";
import { config } from "@/config";
import { ethers } from "ethers";
import { parseEther } from "viem";

interface UserData {
  timer: string;
  amount: string;
  distributeAccounts: string[];
}

const Lock = () => {
  const { address, isConnected, chainId } = useAccount();
  const [date, setDate] = useState<string>("");
  const [walletAddresses, setWalletAddresses] = useState<string[]>([""]);
  const [amount, setAmount] = useState<string>("");
  const [checkUser, setCheckUser] = useState("loading");
  const [userData, setUserData] = useState<UserData | undefined>();
  const [formError, setFormError] = useState("");

  const LockContract = "0x2d5f0779659f8bCE75ABFD19C571F361574C50b4";
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const timerDate = useMemo(() => {
    if (userData && userData.timer) {
      return new Date(parseInt(userData.timer)).toLocaleString();
    } else {
      return ""; // Or any other default value or behavior you prefer
    }
  }, [userData?.timer]);

  const amountInCELO = useMemo(() => {
    if (!userData?.amount) return "";
    return (parseInt(userData.amount) * 1e-18).toLocaleString(undefined, {
      maximumFractionDigits: 18,
    });
  }, [userData?.amount]);
  const transactionExplorerUrl = useMemo(() => {
    return `https://explorer.celo.org/alfajores/tx/${hash}`;
  }, [hash]);

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
    setFormError("");
    setAmount(event.target.value);
  };

  const handleSubmit = async () => {
    if (amount == "0" || amount == "") {
      setFormError("Add an amount to Proceed!");
      return;
    }
    // Format date as block.timestamp (in seconds)
    const timestamp = Math.floor(Date.parse(date) / 1000);
    // Validate wallet addresses
    const validAddresses = walletAddresses.filter((address) =>
      ethers.utils.isAddress(address)
    );
    // Convert amount from Ether to Wei
    const amountInWei = ethers.utils.parseEther(amount);

    // Log the formatted data
    console.log("Formatted data:", { timestamp, validAddresses, amountInWei });

    writeContract({
      address: LockContract,
      abi: LockABI,
      functionName: "Deposit",
      args: [timestamp, validAddresses],
      value: parseEther(`${amount}`),
    });
    setAmount("");
    setDate("");
    setWalletAddresses([""]);
  };
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleWithdraw = async () => {
    writeContract({
      address: LockContract,
      abi: LockABI,
      functionName: "Withdraw",
    });
    console.log("withdraw");
    setUserData({});
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected && address) {
        try {
          const result = await readContract(config, {
            abi: LockABI,
            address: LockContract,
            functionName: "getUserData",
            account: address,
          });
          setUserData(result);
          setCheckUser("have");
          console.log("the result is ", result);
        } catch (err) {
          setCheckUser("notHave");
          console.log("error ", err);
        }
      }
    };
    fetchData();
  }, [address, isConnected]);

  const handleFetch = async () => {
    console.log("processing...");
    try {
      const result = await readContract(config, {
        abi: LockABI,
        address: "0x2d5f0779659f8bCE75ABFD19C571F361574C50b4",
        functionName: "getUserData",
        account: address,
      });
      console.log("the result is ", result);
    } catch (err) {
      console.log("error ", err);
    }
    console.log("done");
  };

  return (
    <div className="container p-4 md:w-1/4 m-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Lock Your Tokens
      </h1>
      {/* <button onClick={handleFetch}>Fetch</button> */}

      {checkUser == "loading" && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin spinner-border h-10 w-10 border-b-2 rounded-full"></div>
        </div>
      )}
      {checkUser == "notHave" && (
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
              className="mt-1 bg-inputDarkBg text-white w-3/4 focus:ring-mainHard focus:border-mainHard block shadow-sm sm:text-sm border border-mainHard rounded-md px-4 py-2"
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
              className="mt-1 w-3/4 input-dark focus:ring-mainHard focus:border-mainHard block shadow-sm sm:text-sm"
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
                    className="mt-1 bg-inputDarkBg text-white focus:ring-mainHard focus:border-mainHard block w-full shadow-sm sm:text-sm border border-mainHard rounded-md px-4 py-2"
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
          <div>{formError}</div>
          <div className="w-full flex flex-wrap">
            {hash && (
              <div className="w-full">
                Transaction Hash:{" "}
                <a
                  className="align-center text-xs text-mainHard"
                  href={transactionExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {hash.substring(0, 8)}...{hash.substring(hash.length - 6)}
                </a>
              </div>
            )}
            {isConfirming && (
              <div className="w-full">Waiting for confirmation...</div>
            )}
            {isConfirmed && (
              <div className="w-full">Transaction confirmed.</div>
            )}
            {error && (
              <div className="w-full">
                Error: {(error as BaseError).shortMessage || error.message}
              </div>
            )}
          </div>

          <div className="fixed bottom-16 left-0 right-0  p-4 sm:p-6 md:w-1/4 md:m-auto">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="inline-flex w-full text-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isPending ? "Confirming..." : "Lock Tokens"}
            </button>
          </div>
        </form>
      )}
      {checkUser == "have" && (
        <div className="container mx-auto p-2 ">
          <div className="rounded-lg">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">
                You Have Locked CELO
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between px-2">
                  <span className="font-semibold">Amount:</span> {amountInCELO}{" "}
                  CELO
                </div>
                <div>
                  <span className="font-semibold">Distribute Accounts:</span>{" "}
                  {userData?.distributeAccounts?.map((account, index) => (
                    <div className="text-xs" key={index}>
                      {account}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between px-2">
                  <span className="font-semibold">Timer:</span> {timerDate}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-wrap">
            {hash && (
              <div className="w-full">
                Transaction Hash:{" "}
                <a
                  className="align-center text-xs text-mainHard"
                  href={transactionExplorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {hash.substring(0, 8)}...{hash.substring(hash.length - 6)}
                </a>
              </div>
            )}
            {isConfirming && (
              <div className="w-full">Waiting for confirmation...</div>
            )}
            {isConfirmed && (
              <div className="w-full">Transaction confirmed.</div>
            )}
            {error && (
              <div className="w-full">
                Error: {(error as BaseError).shortMessage || error.message}
              </div>
            )}
          </div>
          <div className="fixed bottom-16 left-0 right-0  p-4 sm:p-6 md:w-1/4 md:m-auto">
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={isPending}
              className="inline-flex w-full text-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {" "}
              {isPending ? "Confirming..." : "Withdraw"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lock;
