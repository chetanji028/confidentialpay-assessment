# PayrollDistributor — Implementation Notes

## Design Decisions

| Decision | Rationale |
|---|---|
| **Pull/withdrawal pattern** | `distributePayroll` credits a `pendingWithdrawals` mapping instead of pushing ETH. Employees call `withdraw()` themselves. This eliminates reentrancy risk and failures from recipients that cannot accept ETH. |
| **OZ `Ownable` for access control** | Battle-tested, single-owner pattern. OZ v5 requires `Ownable(msg.sender)` in the constructor. |
| **`calldata` for input arrays** | Cheaper than `memory` — data is read directly from the transaction payload without copying. |
| **CEI in `withdraw()`** | `pendingWithdrawals[msg.sender]` is zeroed *before* the external `.call{value:}`. If the call reverts, the entire transaction rolls back, preserving the balance. |
| **`distributed` flag only set on full-range batch** | Partial batches don't mark the cycle done, supporting gas-bounded chunked distribution. |
| **Separate `cycleExists` mapping** | An explicit flag is clearer and cheaper than checking whether a default-initialized struct is "empty". |

## Key Features

1. **`addPayroll(employees, amounts, cycleId)`**
   - Validates array-length parity and non-emptiness.
   - Rejects duplicate cycle IDs.
   - Emits `PayrollAdded` with employee count and total amount.

2. **`distributePayroll(cycleId, startIndex, endIndex)`**
   - Credits `pendingWithdrawals[employee]` — no ETH is sent.
   - Always succeeds (no transfer failures possible).
   - Returns `successCount`.
   - Emits `PaymentProcessed` per recipient for audit trail.

3. **`withdraw()`**
   - Any address with a positive `pendingWithdrawals` balance can call.
   - Uses CEI: zeroes balance → sends ETH → emits `Withdrawn`.
   - Reverts cleanly if the recipient cannot accept ETH (balance is rolled back).

4. **`getCycleStatus(cycleId)`**
   - Pure view — returns `(exists, distributed, totalAmount)`.

5. **Events**
   - `PayrollAdded(cycleId, employeeCount, totalAmount)` — cycle-level summary.
   - `PaymentProcessed(cycleId, recipient, amount, success)` — per-credit audit.
   - `Withdrawn(recipient, amount)` — per-withdrawal audit.

## Testing

16 Foundry test cases, all passing:

| # | Test | Category |
|---|---|---|
| 1 | Happy path: add → distribute → withdraw | Core flow |
| 2 | Duplicate cycle ID reverts | Edge case |
| 3 | Mismatched array lengths revert | Edge case |
| 4 | Empty payroll reverts | Edge case |
| 5 | Non-owner cannot `addPayroll` | Access control |
| 6 | Non-owner cannot `distributePayroll` | Access control |
| 7 | Withdraw with zero balance reverts | Edge case |
| 8 | Withdraw reverts for rejecting contract (balance preserved) | Failure mode |
| 9 | `getCycleStatus` before & after distribution | View function |
| 10 | `PayrollAdded` event correctness | Event verification |
| 11 | `PaymentProcessed` events emitted per recipient | Event verification |
| 12 | `Withdrawn` event emitted on successful withdraw | Event verification |
| 13 | Distribute non-existent cycle reverts | Edge case |
| 14 | Distribute already-distributed cycle reverts | Edge case |
| 15 | End index out of bounds reverts | Edge case |
| 16 | Accumulated withdrawals across multiple cycles | Multi-cycle flow |

## Build & Test

```bash
forge build
forge test -vv

# Single test
forge test --match test_AddDistributeAndWithdraw -vv
```

## Deploy (local Anvil example)

```bash
anvil

forge create src/PayrollDistributor.sol:PayrollDistributor \
  --rpc-url http://127.0.0.1:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## Known Limitations & Future Improvements

- **Native ETH only** — no ERC-20 support yet. Could add an `IERC20.transfer` path.
- **No per-employee paid tracking per cycle** — `distributed` is cycle-wide. Partial batches require careful index management.
- **No batch-size cap** — large ranges could hit the block gas limit.
- **Single owner** — a multi-sig or `AccessControl` would be more appropriate in production.
- **No withdrawal deadline** — unclaimed funds sit in the contract indefinitely. A sweep function with a time lock could address this.
