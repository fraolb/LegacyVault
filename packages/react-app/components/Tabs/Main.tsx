import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getBalance } from "@wagmi/core";
import { config } from "@/config";
import { GetBalanceReturnType } from "@wagmi/core";
import { formatEther } from "viem";

const Main = () => {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState<Array<GetBalanceReturnType | null>>(
    []
  );
  const [celoAddress, setCeloAddress] = useState([]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (isConnected && address) {
        setUserAddress(address);

        // Fetch the balance of the native token
        const nativeTokenBalance = await getBalance(config, {
          address: address,
          token: "0x765de816845861e75a25fca122bb6898b8b1282a",
        });

        // Fetch Uniswap token list
        //https://tokenlists.org/token-list?url=https://gateway.ipfs.io/ipns/tokens.uniswap.org
        const response = await fetch(
          "https://gateway.ipfs.io/ipns/tokens.uniswap.org"
        );
        const { tokens } = await response.json();

        // Filter tokens that are on the Celo mainnet
        const celoMainnetTokens = tokens.filter(
          (token) => token.chainId === 42220
        );
        setCeloAddress(celoMainnetTokens);

        // Fetch balances of Uniswap tokens
        const TokenBalances = await Promise.all(
          celoMainnetTokens.map(async (token) => {
            const balance = await getBalance(config, {
              address: address,
              token: token.address,
            });
            return balance;
          })
        );

        // Update the state with all balances combined
        setBalances([nativeTokenBalance, ...TokenBalances]);
      }
    };

    fetchBalances();
  }, [address, isConnected]);

  return (
    <div>
      <div className="text-mainHard">
        {" "}
        Your address: {userAddress}
        {balances.map((balance, index) => (
          <div key={index}>
            {balance && (
              <div>
                Your balance of {balance.symbol}: {formatEther(balance.value)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        {celoAddress !== null &&
          celoAddress.map((token) => (
            <div key={token.address} className="flex justify-between">
              <div>Name: {token.name}</div>
              <div>Symbol: {token.symbol}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Main;
