// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PayrollDistributor
/// @notice Stores payroll cycles and sends native-token payments in owner-managed batches.
contract PayrollDistributor is Ownable {
    event PayrollAdded(uint256 indexed cycleId, uint256 employeeCount, uint256 totalAmount);
    event PaymentProcessed(uint256 indexed cycleId, address indexed recipient, uint256 amount, bool success);

    struct PayrollCycle {
        address[] employees;
        uint256[] amounts;
        uint256 totalAmount;
        uint256 paidCount;
        bool distributed;
    }

    mapping(uint256 => PayrollCycle) private cycles;
    mapping(uint256 => bool) public cycleExists;
    // An index can only be paid once, including when a failed batch is retried.
    mapping(uint256 => mapping(uint256 => bool)) public paymentCompleted;

    constructor() Ownable(msg.sender) {}

    function addPayroll(
        address[] calldata employees,
        uint256[] calldata amounts,
        uint256 cycleId
    ) external onlyOwner {
        require(employees.length > 0, "Empty payroll");
        require(employees.length == amounts.length, "Array length mismatch");
        require(!cycleExists[cycleId], "Cycle already exists");

        PayrollCycle storage cycle = cycles[cycleId];
        uint256 total;
        for (uint256 i; i < employees.length; ++i) {
            require(employees[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Invalid amount");
            cycle.employees.push(employees[i]);
            cycle.amounts.push(amounts[i]);
            total += amounts[i];
        }
        cycle.totalAmount = total;
        cycleExists[cycleId] = true;

        emit PayrollAdded(cycleId, employees.length, total);
    }

    /// @notice Processes an inclusive index range. Failed sends emit an event and remain retryable.
    function distributePayroll(
        uint256 cycleId,
        uint256 startIndex,
        uint256 endIndex
    ) external onlyOwner returns (uint256 successCount) {
        require(cycleExists[cycleId], "Cycle does not exist");
        PayrollCycle storage cycle = cycles[cycleId];
        require(!cycle.distributed, "Cycle already distributed");
        require(startIndex <= endIndex, "Invalid index range");
        require(endIndex < cycle.employees.length, "End index out of bounds");

        for (uint256 i = startIndex; i <= endIndex; ++i) {
            if (paymentCompleted[cycleId][i]) continue;

            address recipient = cycle.employees[i];
            uint256 amount = cycle.amounts[i];
            // A balance check avoids a reverting call and lets later, smaller payments proceed.
            if (address(this).balance < amount) {
                emit PaymentProcessed(cycleId, recipient, amount, false);
                continue;
            }

            // Mark before the external call to preserve duplicate-payment protection on reentrancy.
            paymentCompleted[cycleId][i] = true;
            (bool sent, ) = payable(recipient).call{value: amount}("");
            if (!sent) {
                paymentCompleted[cycleId][i] = false;
                emit PaymentProcessed(cycleId, recipient, amount, false);
                continue;
            }

            ++cycle.paidCount;
            ++successCount;
            emit PaymentProcessed(cycleId, recipient, amount, true);
        }

        if (cycle.paidCount == cycle.employees.length) cycle.distributed = true;
    }

    function getCycleStatus(uint256 cycleId)
        external
        view
        returns (bool exists, bool distributed, uint256 totalAmount)
    {
        exists = cycleExists[cycleId];
        if (!exists) return (false, false, 0);

        PayrollCycle storage cycle = cycles[cycleId];
        return (true, cycle.distributed, cycle.totalAmount);
    }

    receive() external payable {}
}
