const FAQ = () => {
  return (
    <div className="container w-full mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Frequently Asked Questions
      </h1>
      <div className="space-y-8 mb-10">
        <div>
          <h2 className="text-xl font-semibold mb-2">What is Legacy Vault?</h2>
          <p className="text-justify">
            Legacy Vault is a CELO MiniPay-based personal finance application
            designed to manage your token holdings, facilitate token swaps, and
            enable multiple sends in a single transaction. Additionally, Legacy
            Vault offers a lock functionality, allowing users to store tokens
            for future distribution.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            What is Legacy Vault MultiSend?
          </h2>
          <p className="text-justify">
            MultiSend is a feature in Legacy Vault that enables users to send
            tokens to multiple recipients in a single transaction. Users specify
            the amount to send to each recipient, add recipient wallet
            addresses, and then approve the transaction. After the transaction
            is confirmed, users can view the transaction hash and completion
            message.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            What is Legacy Vault Lock?
          </h2>
          <p className="text-justify">
            Lock is a feature in Legacy Vault where users can store tokens for a
            specified period. Tokens stored in the vault are subject to a time
            lock, and if not withdrawn before the lock expires, they are
            automatically distributed to specified addresses. Users can withdraw
            their locked tokens at any time.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            What is Legacy Vault Swap?
          </h2>
          <p className="text-justify">
            Legacy Vault Swap is a token swapping mechanism offered within
            Legacy Vault. Users can swap tokens held in their wallet for tokens
            listed on Uniswap. The swap function currently utilizes the Uniswap
            widget, with plans to integrate other decentralized exchanges in the
            future.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            What is Legacy Vault Coins?
          </h2>
          <p className="text-justify">
            The Coins page in Legacy Vault displays the token holdings of the
            user's account. Users can view their current token holdings, copy
            token addresses for swapping purposes, and see token values in USD
            for comparison.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
