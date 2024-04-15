import dynamic from "next/dynamic";
import "@uniswap/widgets/fonts.css";
const SwapWidget = dynamic(
  async () => {
    const res = await import("@uniswap/widgets");
    return res.SwapWidget;
  },
  { ssr: false }
);

const Swap = () => {
  return (
    <div>
      <SwapWidget />
    </div>
  );
};

export default Swap;
