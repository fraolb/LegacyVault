import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "@uniswap/widgets/fonts.css";

const SwapWidget = dynamic(
  async () => {
    const res = await import("@uniswap/widgets");
    return res.SwapWidget;
  },
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin spinner-border h-10 w-10 border-b-2 rounded-full"></div>
  </div>
);

const Swap = () => {
  const [celoAddress, setCeloAddress] = useState([]);

  useEffect(() => {
    const fetchBalances = async () => {
      // Fetch Uniswap token list
      //https://tokenlists.org/token-list?url=https://gateway.ipfs.io/ipns/tokens.uniswap.org
      try {
        const response = await fetch(
          "https://cors.bridged.cc/https://gateway.ipfs.io/ipns/tokens.uniswap.org"
        );
        const { tokens } = await response.json();

        // Filter tokens that are on the Celo mainnet
        const celoMainnetTokensFromUniSwap = tokens.filter(
          (token) => token.chainId === 42220
        );
        setCeloAddress(celoMainnetTokensFromUniSwap);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBalances();
  }, []);
  console.log(celoAddress);
  return (
    <div className="container mx-auto pt-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Swap Tokens</h1>
      <SwapWidget tokenList={celoAddress} />
    </div>
  );
};

export default Swap;
