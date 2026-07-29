# PayrollDistributor implementation notes

`PayrollDistributor` accepts native-token payroll cycles from its owner and pays an inclusive range of employees per call. It stores a per-index completion flag, so an already successful payment cannot be sent twice when a range is retried. A failed recipient call or insufficient contract balance emits `PaymentProcessed(..., false)` and the rest of the batch continues; failed entries remain retryable after funding or correcting the recipient environment.

## Design choices

- `Ownable` restricts adding and distributing payroll; the owner should be a multisig in production.
- Arrays are stored once per cycle; `totalAmount` and `paidCount` avoid repeat iteration for status and completion checks.
- The completion flag is set before the low-level value transfer and reset on failure, following checks-effects-interactions while retaining retry support.
- A cycle is marked distributed only after every indexed payment has succeeded, including across multiple batches.

## Test and deploy

From this directory:

```powershell
forge build
forge test -vv
forge create src/PayrollDistributor.sol:PayrollDistributor --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
```

Fund the deployed contract with the native token before calling `distributePayroll`. This assessment implementation pays native ETH/BNB-style currency only. Production work should add ERC-20 support, a batch-size limit, role separation/multisig ownership, and indexed payment getters for richer off-chain reporting.
