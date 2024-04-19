import dynamic from "next/dynamic";
import { useState } from "react";
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
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Swap Tokens</h1>
      <SwapWidget />
    </div>
  );
};

export default Swap;
