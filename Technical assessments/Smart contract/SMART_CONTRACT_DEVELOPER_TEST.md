# ConFiPay - Smart Contract Developer Assessment

## Overview

This is a **1-1.5 hour take-home task** for a smart contract-focused blockchain developer. You will implement a realistic smart contract that handles payroll distribution across multiple chains in the ConFiPay ecosystem.

**The task requires:**
- Writing a Solidity smart contract
- Testing the contract locally
- Documenting implementation decisions
- Running your tests to verify correctness

---

## Time Box

**Aim to complete this task in 1-1.5 hours total.**

Time breakdown:
- Contract implementation: 40-50 min
- Testing & validation: 20-30 min
- Documentation & deployment notes: 10-15 min

---

## Context

ConFiPay is a multi-chain payroll platform. Currently, all payroll execution is mocked on the backend. Your task is to implement a **smart contract that handles payroll distribution**, replacing the mock logic.

### Key Constraints
- Multiple blockchains (BNB, ETH, Base, Solana - focus on EVM chains for this task)
- Employees have different wallet addresses per chain
- Monthly payroll amounts vary by employee (see mock data below)
- Transactions must be immutable and auditable
- Gas efficiency matters (optimize where reasonable)

---

## The Task

### Implement: `PayrollDistributor.sol`

A simple smart contract that:

1. **Tracks pending payroll payments** for employees
2. **Distributes payments in batches** (e.g., multiple employees in one transaction)
3. **Records all payments on-chain** for audit purposes
4. **Prevents duplicate payments** in the same payroll cycle
5. **Handles errors gracefully** (insufficient balance, invalid recipient)

### Required Features

#### Feature 1: Add Pending Payroll (20 min)
```solidity
function addPayroll(
    address[] calldata employees,
    uint256[] calldata amounts,
    uint256 cycleId  // Unique identifier for payroll cycle
) external onlyOwner
```

- Validates arrays match in length
- Validates cycleId hasn't been processed
- Stores employees and amounts for this cycle
- Emits `PayrollAdded` event with cycle details

#### Feature 2: Batch Distribute Payroll (20 min)
```solidity
function distributePayroll(
    uint256 cycleId,
    uint256 startIndex,
    uint256 endIndex
) external onlyOwner returns (uint256 successCount)
```

- Validates cycleId exists and isn't already distributed
- Distributes payments from `startIndex` to `endIndex`
- Skips failed transfers (insufficient balance) but continues
- Marks cycleId as complete once all transferred
- Returns count of successful transfers
- Emits `PaymentProcessed` event for each payment

#### Feature 3: View Cycle Status
```solidity
function getCycleStatus(uint256 cycleId) external view 
  returns (bool exists, bool distributed, uint256 totalAmount)
```

- Returns whether cycle exists
- Returns whether cycle has been distributed
- Returns total amount for the cycle

#### Feature 4: Audit Trail
```solidity
event PayrollAdded(
    uint256 indexed cycleId,
    uint256 employeeCount,
    uint256 totalAmount
);

event PaymentProcessed(
    uint256 indexed cycleId,
    address indexed recipient,
    uint256 amount,
    bool success
);
```

- Events must be emitted for every state change
- Allow filtering by cycleId and recipient

---

## Mock Data for Testing

### Sample Employees & Amounts
```
Cycle #1 (January 2024):
- 0x7f3e1234567890123456789012345678901234ab: 8500 USDC (Alice)
- 0x2a5c1234567890123456789012345678901234cd: 7200 USDC (Bob)
- 0x9b4d1234567890123456789012345678901234ef: 11000 USDC (Carol)

Cycle #2 (February 2024):
- 0x7f3e1234567890123456789012345678901234ab: 8500 USDC (Alice)
- 0x2a5c1234567890123456789012345678901234cd: 7200 USDC (Bob)
- 0x3e7f1234567890123456789012345678901234a1: 9200 USDC (David)
- 0x5c2a1234567890123456789012345678901234b2: 10500 USDC (Eva)
```

---

## Acceptance Criteria

### Implementation Requirements
- ✅ Contract compiles without errors (Solidity 0.8.19+)
- ✅ All 4 features implemented as specified
- ✅ No redundant/inefficient code
- ✅ Access control: only `onlyOwner` can add/distribute payroll
- ✅ Events emitted for all state changes
- ✅ Handles edge cases (empty arrays, duplicate cycles, insufficient balance)

### Testing Requirements
- ✅ At least 8 test cases covering:
  - Happy path: Add and distribute payroll
  - Edge case: Duplicate cycle ID (should revert)
  - Edge case: Invalid array lengths (should revert)
  - Edge case: Insufficient contract balance
  - Edge case: Partial distribution (some transfers fail)
  - Permission: Non-owner cannot call admin functions
  - Events: Correct events emitted with correct params
  - View function: Cycle status returns correct values

- ✅ All tests pass locally

### Code Quality
- ✅ Clear variable/function names
- ✅ Comments explaining key logic
- ✅ No unused variables or imports
- ✅ Follows Solidity best practices (checks-effects-interactions pattern)

---

## Deliverables

1. **PayrollDistributor.sol**
   - Fully implemented smart contract
   - All required functions
   - Events and error handling

2. **PayrollDistributor.test.sol** OR **payroll-distributor.test.js**
   - At least 8 comprehensive test cases
   - Tests for happy path and edge cases
   - All tests passing

3. **IMPLEMENTATION_NOTES.md**
   - Brief explanation of contract design
   - Key decisions and tradeoffs
   - How to deploy and test
   - Any known limitations or future improvements

---

## Setup & Testing

### Option A: Foundry (Recommended for Smart Contract Devs)

```bash
# Create a new foundry project (if needed)
forge init PayrollDistributor

# Install OpenZeppelin (for Ownable)
forge install OpenZeppelin/openzeppelin-contracts

# Compile
forge build

# Run tests
forge test

# Test with verbosity
forge test -vv
```

### Option B: Hardhat (if you prefer JavaScript testing)

```bash
# Init hardhat project
npx hardhat

# Install OpenZeppelin
npm install @openzeppelin/contracts

# Compile
npx hardhat compile

# Run tests
npx hardhat test

# Run with verbosity
npx hardhat test --verbose
```

---

## Reference Contract Structure

Here's a minimal skeleton to get you started:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PayrollDistributor is Ownable {
    
    // Events
    event PayrollAdded(
        uint256 indexed cycleId,
        uint256 employeeCount,
        uint256 totalAmount
    );
    
    event PaymentProcessed(
        uint256 indexed cycleId,
        address indexed recipient,
        uint256 amount,
        bool success
    );
    
    // Data structures
    struct PayrollCycle {
        address[] employees;
        uint256[] amounts;
        bool distributed;
    }
    
    mapping(uint256 => PayrollCycle) public cycles;
    mapping(uint256 => bool) public cycleExists;
    
    // Implementation goes here...
    
    function addPayroll(
        address[] calldata employees,
        uint256[] calldata amounts,
        uint256 cycleId
    ) external onlyOwner {
        // TODO: Implement
    }
    
    function distributePayroll(
        uint256 cycleId,
        uint256 startIndex,
        uint256 endIndex
    ) external onlyOwner returns (uint256 successCount) {
        // TODO: Implement
    }
    
    function getCycleStatus(uint256 cycleId) external view 
        returns (bool exists, bool distributed, uint256 totalAmount) {
        // TODO: Implement
    }
    
    // Receive function to accept ETH/stablecoins
    receive() external payable {}
}
```

---

## Key Considerations

### Security
- ✅ Use `onlyOwner` for sensitive functions
- ✅ Validate input arrays match in length
- ✅ Prevent duplicate cycle processing
- ✅ Handle failed transfers without reverting entire batch

### Gas Efficiency
- Consider using mappings instead of arrays where possible
- Batch processing reduces per-transaction overhead
- Avoid unnecessary storage reads

### Error Handling
- Return `successCount` so caller knows how many succeeded
- Emit events even for failed payments (for audit trail)
- Don't revert on individual payment failures (batch should continue)

---

## Evaluation Criteria

| Criterion | Score | Notes |
|-----------|-------|-------|
| **Functionality** | /5 | Do all features work? Edge cases handled? |
| **Security** | /5 | Proper access control? Input validation? |
| **Code Quality** | /5 | Readable, commented, follows best practices? |
| **Testing** | /5 | Comprehensive tests? All pass? |
| **Documentation** | /5 | Clear IMPLEMENTATION_NOTES? Easy to understand? |

**Passing Score:** 3+ on all criteria (minimum 15/25)

---

## Common Gotchas

❌ **Mistake:** Forgetting to check `cycleExists` before adding a new cycle
- **Fix:** Always validate cycleId is unique before storing

❌ **Mistake:** Arrays in Solidity have fixed length - can't append
- **Fix:** Use storage arrays or mappings with length tracking

❌ **Mistake:** Division before multiplication causes precision loss
- **Fix:** Multiply first, then divide

❌ **Mistake:** `require()` in loop reverts entire batch
- **Fix:** Use try-catch or conditional logic for fault tolerance

---

## Questions?

Review these sections:
1. **Mock Data** - for realistic test scenarios
2. **Reference Contract Structure** - for implementation skeleton
3. **Acceptance Criteria** - for what "done" means
4. **Common Gotchas** - to avoid pitfalls

Good luck! 🚀
