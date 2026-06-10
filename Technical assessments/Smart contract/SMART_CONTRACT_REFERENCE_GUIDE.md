# Smart Contract Developer - Reference Guide

## Solidity Cheat Sheet

### Data Types
```solidity
// Value types
uint256 balance;      // 0 to 2^256-1
uint32 smaller;       // 0 to 2^32-1
int256 canBeNegative; // -2^255 to 2^255-1
address user;         // 20 bytes, checksummed
bool isActive;        // true or false
bytes32 hash;         // 32 bytes fixed

// Reference types (stored in memory/storage)
uint256[] ids;        // Dynamic array
address[5] addrs;     // Fixed array (5 elements)
mapping(uint => uint) ledger;  // Key-value store
```

### Functions & Modifiers
```solidity
// Function types
function publicFunc() public { }           // External + internal
function externalFunc() external { }       // Only external calls
function internalFunc() internal { }       // Only internal calls
function privateFunc() private { }         // Only this contract

// Visibility modifiers
function getBalance() public view returns (uint) {
    return balance;  // Doesn't modify state
}

function updateBalance(uint _new) public {
    balance = _new;  // Modifies state
}

// Custom modifiers
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

function withdraw() public onlyOwner {
    // ...
}
```

### Arrays & Mappings
```solidity
// Dynamic arrays
address[] employees;
employees.push(newEmployee);      // Add
employees.pop();                  // Remove last
uint length = employees.length;   // Get length

// Fixed arrays
address[3] fixed = [addr1, addr2, addr3];

// Mappings (like hash tables)
mapping(address => uint) balances;
balances[alice] = 1000;
uint amount = balances[alice];
delete balances[alice];           // Delete key-value pair

// Cannot iterate mappings! Use arrays for that.
```

### Events & Logging
```solidity
event Transfer(
    address indexed from,
    address indexed to,
    uint256 value
);

function transfer(address to, uint256 amount) public {
    // ... transfer logic ...
    emit Transfer(msg.sender, to, amount);
}

// indexed: allows filtering by this param in logs
// Max 3 indexed params per event
```

### Error Handling
```solidity
// require: validate input
require(amount > 0, "Amount must be positive");
require(msg.sender == owner, "Not authorized");

// revert: abort with error message
if (invalid) {
    revert("Custom error message");
}

// assert: internal consistency checks (uses all gas)
assert(balance >= 0);  // Should never fail
```

### Important Patterns

#### Checks-Effects-Interactions
```solidity
// ✅ CORRECT
function withdraw(uint amount) public {
    // 1. CHECKS - Validate
    require(balances[msg.sender] >= amount, "Insufficient balance");
    
    // 2. EFFECTS - Update state
    balances[msg.sender] -= amount;
    
    // 3. INTERACTIONS - External call last
    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Transfer failed");
}

// ❌ WRONG (reentrancy vulnerability)
function withdraw(uint amount) public {
    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "Transfer failed");
    balances[msg.sender] -= amount;  // Too late!
}
```

#### Batch Processing (Don't revert on first failure)
```solidity
// ✅ CORRECT - Continue on failure
uint successCount = 0;
for (uint i = 0; i < recipients.length; i++) {
    bool success = _sendPayment(recipients[i], amounts[i]);
    if (success) {
        successCount++;
    }
    emit PaymentAttempted(recipients[i], amounts[i], success);
}

// ❌ WRONG - Reverts entire batch
for (uint i = 0; i < recipients.length; i++) {
    _sendPaymentOrRevert(recipients[i], amounts[i]); // Stops all on first failure
}
```

#### Sending ETH Safely
```solidity
// ✅ BEST (recommended)
(bool success, ) = payable(recipient).call{value: amount}("");
require(success, "Transfer failed");

// ⚠️ OLD (not recommended)
recipient.transfer(amount);    // Reverts on failure, fixed 2300 gas
recipient.send(amount);        // Returns bool, fixed 2300 gas
```

---

## Testing Patterns

### Foundry (Solidity Testing)

#### Setup
```bash
forge init MyProject
cd MyProject
forge install OpenZeppelin/openzeppelin-contracts
forge build
forge test
```

#### Test Structure
```solidity
import "forge-std/Test.sol";
import "../src/PayrollDistributor.sol";

contract PayrollDistributorTest is Test {
    PayrollDistributor public payroll;
    address owner = address(1);
    address employee = address(2);
    
    function setUp() public {
        vm.prank(owner);
        payroll = new PayrollDistributor();
    }
    
    function testAddPayroll() public {
        // Arrange
        address[] memory employees = new address[](1);
        employees[0] = employee;
        
        // Act
        vm.prank(owner);
        payroll.addPayroll(employees, new uint256[](1), 1);
        
        // Assert
        (bool exists, , ) = payroll.getCycleStatus(1);
        assertTrue(exists);
    }
}
```

#### Common Assertions
```solidity
// Equality
assertEq(actual, expected);
assertEq(address(a), address(b));

// Boolean
assertTrue(condition);
assertFalse(condition);

// Events
vm.expectEmit(true, true, true, true);  // (indexed, indexed, indexed, data)
emit SomeEvent(param1, param2, param3);
someFunction();

// Reverts
vm.expectRevert("Error message");
someFunction();

vm.expectRevert();  // Any revert
someFunction();
```

#### Common Setup Patterns
```solidity
// Set msg.sender
vm.prank(user);
myContract.doSomething();

// Set block.timestamp
vm.warp(newTimestamp);

// Set ETH balance
vm.deal(user, 100 ether);

// Set storage (advanced)
vm.store(address(contract), slot, value);
```

#### Run Tests
```bash
forge test                    # Run all tests
forge test -v                 # Verbose (show logs)
forge test -vv                # Very verbose (show stack traces)
forge test -vvv               # Show all opcodes
forge test --match testName   # Run specific test
```

---

### Hardhat (JavaScript Testing)

#### Setup
```bash
npm install --save-dev hardhat
npx hardhat
npm install @openzeppelin/contracts
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

#### Test Structure
```javascript
const { expect } = require("chai");

describe("PayrollDistributor", function () {
    let payroll, owner, employee1, employee2;
    
    beforeEach(async function () {
        [owner, employee1, employee2] = await ethers.getSigners();
        const PayrollDistributor = await ethers.getContractFactory("PayrollDistributor");
        payroll = await PayrollDistributor.deploy();
    });
    
    it("should add payroll", async function () {
        // Arrange
        const employees = [employee1.address];
        const amounts = [ethers.parseEther("8500")];
        
        // Act
        await payroll.addPayroll(employees, amounts, 1);
        
        // Assert
        const [exists] = await payroll.getCycleStatus(1);
        expect(exists).to.be.true;
    });
    
    it("should reject duplicate cycle", async function () {
        const employees = [employee1.address];
        const amounts = [ethers.parseEther("8500")];
        
        await payroll.addPayroll(employees, amounts, 1);
        
        // Expect revert
        await expect(
            payroll.addPayroll(employees, amounts, 1)
        ).to.be.revertedWith("Cycle already exists");
    });
    
    it("should handle insufficient balance", async function () {
        const employees = [employee1.address];
        const amounts = [ethers.parseEther("8500")];
        
        await payroll.addPayroll(employees, amounts, 1);
        
        // Don't fund the contract
        const successCount = await payroll.distributePayroll(1, 0, 0);
        expect(successCount).to.equal(0);
    });
});
```

#### Common Assertions
```javascript
// Equality
expect(actual).to.equal(expected);
expect(value).to.be.true;
expect(value).to.be.false;

// Reverts
await expect(promise).to.be.revertedWith("Error message");
await expect(promise).to.be.revert;

// Events
await expect(tx)
    .to.emit(contract, "EventName")
    .withArgs(expectedArg1, expectedArg2);

// Big numbers
const amount = ethers.parseEther("1.0");  // 1 ETH
expect(balance).to.equal(amount);
```

#### Run Tests
```bash
npx hardhat test                    # Run all tests
npx hardhat test --grep testName    # Run specific test
npx hardhat test --reporter spec    # Change reporter
```

---

## Payroll-Specific Tips

### Handling Multiple Decimals
```solidity
// USDC has 6 decimals, ETH has 18
// Always be consistent with your units

uint constant USDC_DECIMALS = 6;
uint constant ETH_DECIMALS = 18;

// 1 USDC = 1_000_000 smallest units
uint usdcAmount = 8500 * 10**USDC_DECIMALS;  // 8500 USDC
```

### Batch Processing Pattern
```solidity
function batchDistribute(
    uint256 cycleId,
    uint256 startIdx,
    uint256 endIdx
) external onlyOwner returns (uint256 successCount) {
    PayrollCycle storage cycle = cycles[cycleId];
    
    for (uint i = startIdx; i <= endIdx; i++) {
        address recipient = cycle.employees[i];
        uint256 amount = cycle.amounts[i];
        
        // Try to send, continue on failure
        bool success = _safeTransfer(recipient, amount);
        
        // Log even failed attempts
        emit PaymentAttempted(cycleId, recipient, amount, success);
        
        if (success) {
            successCount++;
        }
    }
}
```

### Preventing Duplicate Cycles
```solidity
mapping(uint256 => bool) cycleExists;

function addPayroll(
    address[] calldata employees,
    uint256[] calldata amounts,
    uint256 cycleId
) external onlyOwner {
    require(!cycleExists[cycleId], "Cycle already exists");
    
    cycleExists[cycleId] = true;
    cycles[cycleId] = PayrollCycle({
        employees: employees,
        amounts: amounts,
        distributed: false
    });
}
```

---

## Common Issues & Solutions

### ❌ "Array index out of bounds"
```solidity
// WRONG
function distribute(uint256[] memory ids) public {
    for (uint i = 0; i <= ids.length; i++) {  // <= causes overflow!
        process(ids[i]);
    }
}

// CORRECT
function distribute(uint256[] memory ids) public {
    for (uint i = 0; i < ids.length; i++) {  // < is safe
        process(ids[i]);
    }
}
```

### ❌ "Transfer failed silently"
```solidity
// WRONG - doesn't check if it succeeded
payable(user).transfer(amount);

// CORRECT - checks result
(bool success, ) = payable(user).call{value: amount}("");
require(success, "Transfer failed");
```

### ❌ "Contract is missing funds"
```solidity
// WRONG - assumes balance exists
function distribute() public {
    for (uint i = 0; i < recipients.length; i++) {
        payable(recipients[i]).transfer(amounts[i]);  // May fail!
    }
}

// CORRECT - check balance first
function distribute() public {
    require(address(this).balance >= totalAmount, "Insufficient funds");
    for (uint i = 0; i < recipients.length; i++) {
        (bool success, ) = payable(recipients[i]).call{value: amounts[i]}("");
        require(success, "Transfer failed");
    }
}
```

### ❌ "Running out of gas in loops"
```solidity
// PROBLEM - May OOM with large arrays
function procesAllEmployees() public {
    for (uint i = 0; i < employees.length; i++) {
        process(employees[i]);  // What if 10k employees?
    }
}

// SOLUTION - Batch processing with limits
function processBatch(uint256 startIdx, uint256 endIdx) public {
    require(endIdx - startIdx <= 100, "Batch too large");  // Limit batch size
    
    for (uint i = startIdx; i <= endIdx; i++) {
        process(employees[i]);
    }
}
```

---

## Deployment Checklist

- [ ] Contract compiles without errors
- [ ] All tests pass
- [ ] Access control verified (onlyOwner works)
- [ ] Edge cases handled (empty arrays, invalid input)
- [ ] Events emit correctly
- [ ] Gas usage reasonable (no massive loops)
- [ ] Documentation includes:
  - How to deploy
  - How to test
  - Constructor parameters (if any)
  - Key functions explained

---

## Resources

- **Solidity Docs:** https://docs.soliditylang.org/
- **Foundry Book:** https://book.getfoundry.sh/
- **Hardhat Docs:** https://hardhat.org/docs
- **OpenZeppelin Contracts:** https://github.com/OpenZeppelin/openzeppelin-contracts
- **Solidity by Example:** https://solidity-by-example.org/

