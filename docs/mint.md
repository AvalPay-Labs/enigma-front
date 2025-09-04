# Balance & Amount

In traditional token systems, balances are stored as simple numbers. However, in this privacy-focused system, balances are encrypted to maintain confidentiality. The system uses two main types of encryption:

1. The actual balance is encrypted using ElGamal encryption (EGCT - ElGamal Ciphertext), which allows for mathematical operations on encrypted values. This is stored in the _balances_ mapping on the Encrypted ERC smart contract, which tracks encrypted balances for each user and token ID.

```solidity
struct EncryptedBalance {
    EGCT eGCT;
    mapping(uint256 index => BalanceHistory history) balanceList;
    uint256 nonce;
    uint256 transactionIndex;
    uint256[7] balancePCT; 
    AmountPCT[] amountPCTs;
}
```

2. Utilizing Poseidon Ciphertexts for verifying user transaction history and balance
   * **Amount PCTs:** These are encrypted records of individual transactions (deposits, transfers, etc.) that affect a user's balance. Think of them as encrypted receipts that prove each change to the balance. They're stored in an array because a user can have multiple transactions.
   * **Balance PCT:** This is a single encrypted value that represents the current total balance. It's like a running checksum that helps verify the overall balance is correct. Unlike Amount PCTs, there's only one Balance PCT per user-token pair at any time.

**The balanceList** is a mapping that stores snapshots of valid balance states. Each time a user's balance changes (through transfers, mints, or withdrawals), the system creates a hash of the new encrypted balance (EGCT) combined with the current nonce. This hash serves as a key in the balanceList mapping, pointing to a BalanceHistory entry that marks this state as valid and records when it occurred.

**The nonce** acts as a versioning system. Instead of deleting old balance records when they become invalid, the system simply increments the nonce. This is particularly efficient because it instantly invalidates all previous balance states without having to modify them individually. When verifying a balance, the system combines the balance hash with the current nonce - if the nonce has changed, old balance states won't match and are considered invalid.

When a user's balance changes, the system:

* Updates the encrypted balance (EGCT)
* Stores the Amount PCT for the transaction
* Updates the Balance PCT when needed
* Creates a hash of the new encrypted balance
* Combines it with the current nonce
* Stores this state in the balanceList with the current transactionIndex
* Increments the transactionIndex for the next transaction



