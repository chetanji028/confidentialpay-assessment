// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PayrollDistributor
/// @notice Credits employee payroll on-chain; employees withdraw their own funds (pull pattern).
/// @dev    The pull/withdrawal pattern eliminates reentrancy risk and failures
///         from recipients that cannot accept ETH via receive().
contract PayrollDistributor is Ownable {

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

    event Withdrawn(address indexed recipient, uint256 amount);

    struct PayrollCycle {
        address[] employees;
        uint256[] amounts;
        bool distributed;
    }

    mapping(uint256 => PayrollCycle) internal cycles;
    mapping(uint256 => bool) public cycleExists;

    /// @notice Withdrawable balance per employee (accumulated across cycles).
    mapping(address => uint256) public pendingWithdrawals;

    constructor() Ownable(msg.sender) {}

    function addPayroll(
        address[] calldata employees,
        uint256[] calldata amounts,
        uint256 cycleId
    ) external onlyOwner {
        require(employees.length == amounts.length, "Array length mismatch");
        require(employees.length > 0, "Empty payroll");
        require(!cycleExists[cycleId], "Cycle already exists");

        PayrollCycle storage c = cycles[cycleId];
        for (uint256 i; i < employees.length; ++i) {
            c.employees.push(employees[i]);
            c.amounts.push(amounts[i]);
        }
        cycleExists[cycleId] = true;

        uint256 total;
        for (uint256 i; i < amounts.length; ++i) {
            total += amounts[i];
        }

        emit PayrollAdded(cycleId, employees.length, total);
    }

    /// @notice Credit each employee's withdrawable balance for a batch range.
    ///         Does NOT send ETH — employees call `withdraw()` themselves.
    function distributePayroll(
        uint256 cycleId,
        uint256 startIndex,
        uint256 endIndex
    ) external onlyOwner returns (uint256 successCount) {
        require(cycleExists[cycleId], "Cycle does not exist");

        PayrollCycle storage c = cycles[cycleId];
        require(!c.distributed, "Cycle already distributed");
        require(startIndex <= endIndex, "Invalid index range");
        require(endIndex < c.employees.length, "End index out of bounds");

        for (uint256 i = startIndex; i <= endIndex; ++i) {
            address recipient = c.employees[i];
            uint256 amount = c.amounts[i];

            // Credit the employee's withdrawable balance
            pendingWithdrawals[recipient] += amount;
            ++successCount;

            emit PaymentProcessed(cycleId, recipient, amount, true);
        }

        // Mark distributed when the full range is processed
        if (startIndex == 0 && endIndex == c.employees.length - 1) {
            c.distributed = true;
        }
    }

    /// @notice Employees call this to withdraw their accumulated payroll.
    function withdraw() external {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        // Effects before interactions (CEI)
        pendingWithdrawals[msg.sender] = 0;

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "Withdraw failed");

        emit Withdrawn(msg.sender, amount);
    }

    function getCycleStatus(
        uint256 cycleId
    ) external view returns (bool exists, bool distributed, uint256 totalAmount) {
        exists = cycleExists[cycleId];
        if (!exists) return (false, false, 0);

        PayrollCycle storage c = cycles[cycleId];
        distributed = c.distributed;
        for (uint256 i; i < c.amounts.length; ++i) {
            totalAmount += c.amounts[i];
        }
    }

    receive() external payable {}
}
