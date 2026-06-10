# Smart Contract Developer - Getting Started

## Welcome! 👋

You're taking the ConFiPay smart contract developer assessment. This is a **1-1.5 hour coding task** where you'll implement a Solidity smart contract for payroll distribution.

---

## What You'll Do

**Implement `PayrollDistributor.sol`** - A smart contract that:
1. Accepts payroll data for employees
2. Distributes payments in batches
3. Records all transactions on-chain
4. Prevents duplicate payment cycles

**Requirements:**
- Write a Solidity contract (0.8.19+)
- Create 8+ test cases
- Document your implementation
- **All within 1-1.5 hours**

---

## Quick Start

### Step 1: Choose Your Testing Framework

#### Option A: Foundry (Recommended)
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Create project
forge init PayrollDistributor
cd PayrollDistributor

# Add OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts

# Build
forge build

# Run tests
forge test
```

#### Option B: Hardhat
```bash
# Create directory
mkdir PayrollDistributor
cd PayrollDistributor

# Init Node project
npm init -y

# Install Hardhat
npm install --save-dev hardhat
npx hardhat

# Install dependencies
npm install @openzeppelin/contracts

# Compile
npx hardhat compile

# Run tests
npx hardhat test
```

---

## Step 2: Read the Task

Open **SMART_CONTRACT_DEVELOPER_TEST.md**

Key sections:
- **Time Box:** 1-1.5 hours
- **The Task:** Implement PayrollDistributor.sol with 4 features
- **Acceptance Criteria:** What "done" looks like
- **Mock Data:** Sample employees and amounts for testing

---

## Step 3: Use the Reference Guide

**SMART_CONTRACT_REFERENCE_GUIDE.md** contains:
- Solidity cheat sheet (arrays, mappings, functions)
- Testing patterns (Foundry and Hardhat)
- Common gotchas and solutions
- Batch processing tips

**Bookmark it!** You'll reference this while implementing.

---

## Step 4: Implement

### File Structure (Foundry)
```
PayrollDistributor/
├── src/
│   └── PayrollDistributor.sol    ← YOUR CONTRACT
├── test/
│   └── PayrollDistributor.t.sol  ← YOUR TESTS
└── lib/
    └── openzeppelin-contracts/
```

### File Structure (Hardhat)
```
PayrollDistributor/
├── contracts/
│   └── PayrollDistributor.sol    ← YOUR CONTRACT
├── test/
│   └── payroll-distributor.test.js  ← YOUR TESTS
└── node_modules/
```

### Implementation Checklist
- [ ] Contract compiles without errors
- [ ] Feature 1: `addPayroll()` - Add pending payroll data
- [ ] Feature 2: `distributePayroll()` - Send payments in batches
- [ ] Feature 3: `getCycleStatus()` - View cycle information
- [ ] Feature 4: Events emitted for all state changes
- [ ] Access control: `onlyOwner` for admin functions
- [ ] Error handling: Gracefully handle failures

---

## Step 5: Test

### Foundry
```bash
# Run all tests
forge test

# Verbose output
forge test -vv

# Specific test
forge test --match testAddPayroll
```

### Hardhat
```bash
# Run all tests
npx hardhat test

# Specific file
npx hardhat test test/payroll-distributor.test.js

# Verbose
npx hardhat test --reporter spec
```

**Target:** 8+ tests, all passing ✅

---

## Step 6: Document

Create **IMPLEMENTATION_NOTES.md** with:

```markdown
# PayrollDistributor Implementation Notes

## Design Decisions
- Used struct for PayrollCycle (stores employees + amounts + status)
- Used mapping for O(1) cycle lookups
- Batch processing with fault tolerance (continue on payment failure)

## Key Features
1. **addPayroll()** - Validates inputs, prevents duplicates
2. **distributePayroll()** - Processes payments in range [startIdx, endIdx]
3. **getCycleStatus()** - Returns cycle existence, distribution status, total amount
4. **Events** - PayrollAdded and PaymentProcessed for audit trail

## Testing
- 8 test cases cover happy path and edge cases
- All tests passing locally
- Tested with Foundry

## Deployment
1. Compile: `forge build`
2. Test: `forge test`
3. Deploy: `forge create src/PayrollDistributor.sol:PayrollDistributor`

## Known Limitations
- Only supports EVM chains (hardcoded value transfers)
- No persistence layer (in-memory only)
- Single-threaded batch processing
```

---

## Deliverables Checklist

**When submitting, include:**

1. ✅ `PayrollDistributor.sol` - Fully implemented contract
2. ✅ `PayrollDistributor.test.sol` (or `.test.js`) - Test suite with 8+ tests
3. ✅ `IMPLEMENTATION_NOTES.md` - Brief explanation and deployment guide

---

## Tips for Success

### ⏱️ Time Management
- 0-10 min: Read task, plan implementation
- 10-50 min: Write contract
- 50-80 min: Write tests and debug
- 80-90 min: Document and polish

### 🎯 Focus
- Get the core features working first
- Add error handling after basic logic works
- Tests should start simple (happy path), then complex (edge cases)

### 🧪 Testing Strategy
```
Test 1: Happy path (add payroll, distribute successfully)
Test 2-3: Edge cases (duplicate cycles, mismatched arrays)
Test 4-5: Permission checks (non-owner, unauthorized access)
Test 6-7: Failure modes (insufficient balance, out of bounds)
Test 8+: Verify events and state changes
```

### 🔍 Common Mistakes to Avoid

❌ Forgetting to validate array lengths
```solidity
require(employees.length == amounts.length, "Mismatch");
```

❌ Not preventing duplicate cycle IDs
```solidity
require(!cycleExists[cycleId], "Already exists");
```

❌ Reverting entire batch on first failure (should continue)
```solidity
for (uint i = start; i <= end; i++) {
    bool success = _sendPayment(...);  // Don't require(success)
    if (success) successCount++;
}
```

❌ Missing events
```solidity
emit PayrollAdded(cycleId, employees.length, totalAmount);
```

---

## Example Test (Foundry)

```solidity
function testDistributePayrollSuccess() public {
    // Setup
    address[] memory employees = new address[](2);
    employees[0] = address(0x111);
    employees[1] = address(0x222);
    
    uint256[] memory amounts = new uint256[](2);
    amounts[0] = 8500e18;
    amounts[1] = 7200e18;
    
    // Fund contract
    vm.deal(address(payroll), 20000e18);
    
    // Add payroll
    vm.prank(owner);
    payroll.addPayroll(employees, amounts, 1);
    
    // Distribute
    vm.prank(owner);
    uint256 successCount = payroll.distributePayroll(1, 0, 1);
    
    // Verify
    assertEq(successCount, 2);
    assertEq(address(0x111).balance, 8500e18);
    assertEq(address(0x222).balance, 7200e18);
}
```

---

## Need Help?

- **Solidity reference:** See SMART_CONTRACT_REFERENCE_GUIDE.md
- **Testing examples:** Foundry docs or Hardhat docs
- **Task details:** See SMART_CONTRACT_DEVELOPER_TEST.md
- **Gotchas:** Search "Common Gotchas" in the reference guide

---

## Submit Your Work

Package your deliverables:
```
submission/
├── PayrollDistributor.sol (or src/PayrollDistributor.sol)
├── PayrollDistributor.test.sol (or test/payroll-distributor.test.js)
├── IMPLEMENTATION_NOTES.md
└── (Optional) foundry.toml or hardhat.config.js
```

---

**Good luck! You've got this! 🚀**

Questions? Review the reference guide or test task document first.

