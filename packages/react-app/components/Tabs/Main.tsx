import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getBalance, getAccount } from "@wagmi/core";
import { config } from "@/config";
import { GetBalanceReturnType } from "@wagmi/core";
import { formatEther } from "viem";
import { ethers } from "ethers";
import TokenList from "../../assets/MainnetTokens.json";
import nativeCeloTokens from "../../assets/celoNativeTokens.json";
import testnetCeloTokens from "../../assets/TestnetTokens.json";

const Main = () => {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected, chainId } = useAccount();
  const account = getAccount(config);

  const [balances, setBalances] = useState<Array<GetBalanceReturnType | null>>(
    []
  );
  const [celoAddress, setCeloAddress] = useState([]);

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Token address copied to clipboard");
        // You can optionally provide feedback to the user here, such as displaying a message or changing the button text
      })
      .catch((error) => {
        console.error("Unable to copy token address to clipboard:", error);
        // Handle any errors that might occur during copying
      });
  }
  console.log("the chain id is ", account, address, chainId);

  useEffect(() => {
    const fetchBalances = async () => {
      if (isConnected && address) {
        setUserAddress(address);

        // Fetch the balance of the native token
        const nativeTokenBalance = await Promise.all(
          (chainId == 42220 ? nativeCeloTokens : testnetCeloTokens).map(
            async (token) => {
              const TokenAddress = token.address;
              const TokenSymbol = token.symbol;
              const balance = await getBalance(config, {
                address: address,
                token: token.address,
              });
              return { ...balance, token: TokenAddress, symbol: TokenSymbol };
            }
          )
        );
        setBalances([...nativeTokenBalance]);

        if (chainId !== 42220) {
          const balance = await getBalance(config, {
            address: address,
          });
          console.log("the coin native ", balance);
          setBalances([
            {
              value: balance?.value,
              symbol: balance?.symbol,
              decimals: balance?.decimals,
              formatted: balance?.formatted,
              token: "",
            },
            ...nativeTokenBalance,
          ]);
        }

        // Fetch Uniswap token list
        //https://tokenlists.org/token-list?url=https://gateway.ipfs.io/ipns/tokens.uniswap.org
        if (chainId == 42220) {
          try {
            //   const response = await fetch(
            //     "https://cors.bridged.cc/https://gateway.ipfs.io/ipns/tokens.uniswap.org"
            //   );
            //   const { tokens } = await response.json();

            // Filter tokens that are on the Celo mainnet
            // const celoMainnetTokensFromUniSwap = tokens.filter(
            //   (token) => token.chainId === 42220
            // );

            //setCeloAddress(celoMainnetTokensFromUniSwap);

            // Fetch balances of Uniswap tokens
            const TokenBalances = await Promise.all(
              TokenList.map(async (token) => {
                const TokenAddress = token.address;
                const balance = await getBalance(config, {
                  address: address,
                  token: token.address,
                });
                return { ...balance, token: TokenAddress };
              })
            );

            // Update the state with all balances combined
            setBalances([...nativeTokenBalance, ...TokenBalances]);
          } catch (err) {
            console.log(err);
          }
        }
      }
    };

    fetchBalances();
  }, [address, isConnected]);

  console.log(balances);

  return (
    <div className="container w-full p-4 ">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Token Balances
      </h1>

      {balances.length === 0 && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin spinner-border h-10 w-10 border-b-2 rounded-full"></div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 mb-12">
        {balances.map((balance, index) => (
          <div
            key={index}
            className="bg-inputDarkBg border border-mainHard text-white w-full text-mainHard rounded-lg shadow-lg p-2 px-4 flex items-center justify-between"
          >
            {balance && (
              <>
                <div className="flex flex-col">
                  <div className="text-xl font-semibold text-left">
                    {balance.symbol}
                  </div>
                  <div className="flex text-mainHard items-center mt-1">
                    <span className="text-sm">
                      {balance.token.substring(0, 4)}...
                      {balance.token.substring(balance.token.length - 4)}
                    </span>
                    <button
                      className="ml-2 text-sm text-disabled hover:text-mainHard focus:outline-none"
                      onClick={() => copyToClipboard(balance.token)}
                    >
                      <svg
                        width="16px"
                        height="16px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="text-2xl font-semibold">
                  {balance.value !== undefined &&
                    ethers.utils.formatEther(balance.value)?.substring(0, 4)}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
