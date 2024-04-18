import { useState } from "react";
import { ethers } from "ethers";
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseEther } from "viem";

const Transfer = () => {
  const [address, setAddress] = useState("");
  const { signTransaction } = useAccount();
  const {
    data: hash,
    isPending,
    isError,
    sendTransaction,
  } = useSendTransaction();

  async function submit() {
    if (address == "") {
      return;
    }

    const to = address;
    const value = "0.1";
    sendTransaction({ to, value: parseEther(value) });
    sendTransaction({ to, value: parseEther(value) });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleMultiSend = async () => {
    const transactions = [
      {
        to: "0xRecipientAddress1",
        value: "1000000000000000000", // Amount in wei (e.g., 1 CELO)
        feeCurrency: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", // cUSD address
      },
      {
        to: "0xRecipientAddress2",
        value: "500000000000000000", // Amount in wei (e.g., 0.5 CELO)
        feeCurrency: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", // cUSD address
      },
      // Add more transactions as needed
    ];

    try {
      const signedTransactions = await signTransaction(transactions);
      console.log("Signed transactions:", signedTransactions);
    } catch (error) {
      console.error("Error signing transactions:", error);
    }
  };

  return (
    <div className="block">
      <input
        name="address"
        placeholder="0xA0Cf…251e"
        onChange={(e) => setAddress(e.target.value)}
        className="border border-2"
      />
      <button
        disabled={isPending}
        onClick={() => submit()}
        className="border border-2 m-4"
      >
        {isPending ? "Confirming..." : "Send 0.1 eth"}
      </button>
      {isPending && <span>Waiting for confirmation on your wallet</span>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed.</div>}

      {isError && <span>You rejected the transaction on your wallet</span>}

      <div>
        <button>Send Multiple</button>
      </div>
    </div>
  );
};

export default Transfer;
