"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import Main from "@/components/Tabs/Main";
import Lock from "@/components/Tabs/Lock";
import Swap from "@/components/Tabs/Swap";
import MultiSend from "@/components/Tabs/MultiSend";
import Settings from "@/components/Tabs/Settings";
import Transfer from "@/components/Tabs/Transfer";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const [selectedPage, setSelectedPage] = useState(2);

  if (typeof window !== "undefined") {
    // @ts-ignore
    window.Browser = {
      T: () => {},
    };
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const selectPage = (e: number) => {
    setSelectedPage(e);
  };

  return (
    <div className="flex flex-col ">
      {isConnected ? (
        <div className="h2 text-center">
          <div className="p-2">
            {selectedPage == 0 ? (
              <Main />
            ) : selectedPage == 1 ? (
              <Swap />
            ) : selectedPage == 2 ? (
              <MultiSend />
            ) : selectedPage == 3 ? (
              <Lock />
            ) : (
              <Settings />
            )}
          </div>

          <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
              <button
                type="button"
                className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                  selectedPage === 0 ? "bg-mainBg text-mainHard" : ""
                }`}
                onClick={() => selectPage(0)}
              >
                <svg
                  className={`w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-mainHard ${
                    selectedPage === 0 ? "text-mainHard" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 22 22"
                >
                  <path
                    d="M12 16H13C13.6667 16 15 15.6 15 14C15 12.4 13.6667 12 13 12H11C10.3333 12 9 11.6 9 10C9 8.4 10.3333 8 11 8H12M12 16H9M12 16V18M15 8H12M12 8V6M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span
                  className={`text-sm text-black group-hover:text-mainHard ${
                    selectedPage === 0 ? "text-mainHard" : ""
                  }`}
                >
                  Coins
                </span>
              </button>

              <button
                type="button"
                className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                  selectedPage === 1 ? "bg-mainBg text-mainHard" : ""
                }`}
                onClick={() => selectPage(1)}
              >
                <svg
                  className={`w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-mainHard ${
                    selectedPage === 1 ? "text-mainHard" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="2 2 20 20"
                >
                  <path
                    d="M8 3.5L8 16.5M8 3.5L3.5 7.83333M8 3.5L12.5 7.83333"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17 20.5L17 7.5M17 20.5L21.5 16.1667M17 20.5L12.5 16.1667"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span
                  className={`text-sm text-black group-hover:text-mainHard ${
                    selectedPage === 1 ? "text-mainHard" : ""
                  }`}
                >
                  Swap
                </span>
              </button>

              <button
                type="button"
                className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                  selectedPage === 2 ? "bg-mainBg text-mainHard" : ""
                }`}
                onClick={() => selectPage(2)}
              >
                <svg
                  className={`w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-mainHard ${
                    selectedPage === 2 ? "text-mainHard" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 2 20 17"
                >
                  <path
                    d="M10 14L12.2728 19.3032C12.5856 20.0331 13.5586 20.1103 13.9486 19.4185C14.7183 18.0535 15.8591 15.8522 17 13C19 8 20 4 20 4M10 14L4.69678 11.7272C3.96687 11.4144 3.88975 10.4414 4.58149 10.0514C5.94647 9.28173 8.14784 8.14086 11 7C16 5 20 4 20 4M10 14L20 4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span
                  className={`text-sm text-black group-hover:text-mainHard ${
                    selectedPage === 2 ? "text-mainHard" : ""
                  }`}
                >
                  MSend
                </span>
              </button>

              <button
                type="button"
                className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                  selectedPage === 3 ? "bg-mainBg text-mainHard" : ""
                }`}
                onClick={() => selectPage(3)}
              >
                <svg
                  className={`w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-mainHard ${
                    selectedPage === 3 ? "text-mainHard" : ""
                  }`}
                  // width="800px"
                  // height="800px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span
                  className={`text-sm text-black group-hover:text-mainHard ${
                    selectedPage === 3 ? "text-mainHard" : ""
                  }`}
                >
                  Lock
                </span>
              </button>

              <button
                type="button"
                className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${
                  selectedPage === 4 ? "bg-mainBg text-mainHard" : ""
                }`}
                onClick={() => selectPage(4)}
              >
                <svg
                  className={`w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-mainHard ${
                    selectedPage === 4 ? "text-mainHard" : ""
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
                  />
                </svg>
                <span
                  className={`text-sm text-black group-hover:text-mainHard ${
                    selectedPage === 4 ? "text-mainHard" : ""
                  }`}
                >
                  FAQ
                </span>
              </button>
            </div>
          </div>

          <div></div>
        </div>
      ) : (
        <div>No Wallet Connected</div>
      )}
    </div>
  );
}
