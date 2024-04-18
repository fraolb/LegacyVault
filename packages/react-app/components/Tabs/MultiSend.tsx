import { useState, useEffect } from "react";
import { newKit, newKitFromWeb3 } from "@celo/contractkit";
import { useAccount } from "wagmi";

const MultiSend = () => {
  const [addresses, setAddresses] = useState<string[]>([""]);
  const [amount, setAmount] = useState<string>("");
  const { address, isConnected } = useAccount();
  const [userAddress, setUserAddress] = useState("");

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

  const handleSend = async () => {
    // Initialize ContractKit with the desired Celo network endpoint
    const kit = newKit("https://alfajores-forno.celo-testnet.org");
    let accounts = await kit.web3.eth.getAccounts();
    if (accounts.length === 0) {
      console.error("No accounts found in the connected wallet");
      return;
    }
    console.log("the account is", accounts[0]);
    let totalBalance = kit.getTotalBalance(userAddress);
    console.log("total balance of : ", userAddress, totalBalance);
    // Set the default account to the first account in the accounts array
    //kit.defaultAccount = `${accounts[0]}`;

    // Ensure amount is valid
    if (!amount || parseFloat(amount) <= 0) {
      console.error("Invalid amount");
      return;
    }

    // Ensure there is at least one recipient address
    if (addresses.length === 0) {
      console.error("No recipient addresses provided");
      return;
    }

    try {
      // Calculate the amount to send in wei
      const amountInWei = kit.connection.web3.utils.toWei(amount, "ether");

      // Get the cUSD contract
      const stableToken = await kit.contracts.getStableToken();

      // Transfer funds to each recipient
      for (const address of addresses) {
        // Send the transaction to transfer funds to the recipient
        const tx = await stableToken.transfer(address, amountInWei).send({
          from: userAddress,
        });

        // Wait for the transaction to be mined and get the receipt
        const receipt = await tx.waitReceipt();
        console.log(
          `Funds sent to ${address}: Transaction hash - ${receipt.transactionHash}`
        );
      }

      console.log(`Total amount sent: ${amountInWei} wei`);
    } catch (error) {
      console.error("Error sending multi-send transaction:", error);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, []);

  return (
    <div className="container p-4 sm:p-6 border border-red-500">
      <h1 className="text-3xl font-semibold mb-4 text-center">MultiSender</h1>
      <h6 className="text-sm font-semibold mb-4 text-center">{userAddress}</h6>
      <form className="space-y-6">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="mt-1 focus:ring-blue-500 w-full focus:border-blue-500 block shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-2 border"
          />
        </div>
        {addresses.map((address, index) => (
          <div key={index} className="border border-gray-300 rounded-md mb-4">
            <label
              htmlFor={`address-${index}`}
              className="block text-sm font-medium text-gray-700 px-4 py-2"
            >
              Address {index + 1}
            </label>
            <input
              id={`address-${index}`}
              type="text"
              value={address}
              onChange={(e) => handleAddressChange(index, e.target.value)}
              className="flex-1 focus:ring-blue-500 w-full focus:border-blue-500 block shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-2 border-t-0"
            />
          </div>
        ))}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddAddress}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Address
          </button>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSend}
            className="inline-flex w-full text-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiSend;
