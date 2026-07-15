// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PayrollDistributor.sol";

/// @dev Contract that rejects ETH — used to prove withdraw() reverts cleanly
///      for contracts that cannot accept funds.
contract RejectingReceiver {
    receive() external payable {
        revert("I reject ETH");
    }
}

contract PayrollDistributorTest is Test {
    PayrollDistributor public payroll;
    address public owner;
    address public nonOwner;

    // Sample employee addresses (from the mock data)
    address public alice = address(0x7F3E1234567890123456789012345678901234aB);
    address public bob   = address(0x2a5c1234567890123456789012345678901234cd);
    address public carol = address(0x9b4D1234567890123456789012345678901234eF);

    function setUp() public {
        owner = address(this);
        nonOwner = address(0xBEEF);

        payroll = new PayrollDistributor();
    }

    // ───────────────── Helpers ─────────────────

    function _addCycle1() internal {
        address[] memory employees = new address[](3);
        employees[0] = alice;
        employees[1] = bob;
        employees[2] = carol;

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 8500 ether;
        amounts[1] = 7200 ether;
        amounts[2] = 11000 ether;

        payroll.addPayroll(employees, amounts, 1);
    }

    // ═══════════════════════════════════════════
    //  Test 1 — Happy path: add, distribute, withdraw
    // ═══════════════════════════════════════════

    function test_AddDistributeAndWithdraw() public {
        _addCycle1();
        vm.deal(address(payroll), 30000 ether);

        uint256 successCount = payroll.distributePayroll(1, 0, 2);
        assertEq(successCount, 3, "All 3 should be credited");

        // Verify pending balances were credited
        assertEq(payroll.pendingWithdrawals(alice), 8500 ether);
        assertEq(payroll.pendingWithdrawals(bob),   7200 ether);
        assertEq(payroll.pendingWithdrawals(carol), 11000 ether);

        // Alice withdraws
        vm.prank(alice);
        payroll.withdraw();
        assertEq(alice.balance, 8500 ether);
        assertEq(payroll.pendingWithdrawals(alice), 0);

        // Bob withdraws
        vm.prank(bob);
        payroll.withdraw();
        assertEq(bob.balance, 7200 ether);
    }

    // ═══════════════════════════════════════════
    //  Test 2 — Edge case: Duplicate cycle ID reverts
    // ═══════════════════════════════════════════

    function test_RevertOnDuplicateCycleId() public {
        _addCycle1();

        address[] memory employees = new address[](1);
        employees[0] = alice;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1 ether;

        vm.expectRevert("Cycle already exists");
        payroll.addPayroll(employees, amounts, 1);
    }

    // ═══════════════════════════════════════════
    //  Test 3 — Edge case: Mismatched array lengths
    // ═══════════════════════════════════════════

    function test_RevertOnMismatchedArrayLengths() public {
        address[] memory employees = new address[](2);
        employees[0] = alice;
        employees[1] = bob;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1 ether;

        vm.expectRevert("Array length mismatch");
        payroll.addPayroll(employees, amounts, 1);
    }

    // ═══════════════════════════════════════════
    //  Test 4 — Edge case: Empty payroll reverts
    // ═══════════════════════════════════════════

    function test_RevertOnEmptyPayroll() public {
        address[] memory employees = new address[](0);
        uint256[] memory amounts = new uint256[](0);

        vm.expectRevert("Empty payroll");
        payroll.addPayroll(employees, amounts, 1);
    }

    // ═══════════════════════════════════════════
    //  Test 5 — Permission: Non-owner cannot addPayroll
    // ═══════════════════════════════════════════

    function test_NonOwnerCannotAddPayroll() public {
        address[] memory employees = new address[](1);
        employees[0] = alice;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1 ether;

        vm.prank(nonOwner);
        vm.expectRevert();
        payroll.addPayroll(employees, amounts, 1);
    }

    // ═══════════════════════════════════════════
    //  Test 6 — Permission: Non-owner cannot distributePayroll
    // ═══════════════════════════════════════════

    function test_NonOwnerCannotDistributePayroll() public {
        _addCycle1();

        vm.prank(nonOwner);
        vm.expectRevert();
        payroll.distributePayroll(1, 0, 2);
    }

    // ═══════════════════════════════════════════
    //  Test 7 — Withdraw with nothing reverts
    // ═══════════════════════════════════════════

    function test_WithdrawWithNothingReverts() public {
        vm.prank(alice);
        vm.expectRevert("Nothing to withdraw");
        payroll.withdraw();
    }

    // ═══════════════════════════════════════════
    //  Test 8 — Withdraw fails for rejecting contract
    // ═══════════════════════════════════════════

    function test_WithdrawRevertsForRejectingRecipient() public {
        RejectingReceiver rejector = new RejectingReceiver();

        address[] memory employees = new address[](1);
        employees[0] = address(rejector);
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1 ether;

        payroll.addPayroll(employees, amounts, 10);
        vm.deal(address(payroll), 10 ether);
        payroll.distributePayroll(10, 0, 0);

        // Rejector tries to withdraw — the low-level call fails
        vm.prank(address(rejector));
        vm.expectRevert("Withdraw failed");
        payroll.withdraw();

        // Balance was zeroed (CEI), but the revert rolled it back,
        // so the pending amount is still available for a future retry.
        assertEq(payroll.pendingWithdrawals(address(rejector)), 1 ether);
    }

    // ═══════════════════════════════════════════
    //  Test 9 — View: getCycleStatus returns correct values
    // ═══════════════════════════════════════════

    function test_GetCycleStatusBeforeAndAfterDistribution() public {
        // Non-existent cycle
        (bool exists, bool distributed, uint256 total) = payroll.getCycleStatus(99);
        assertFalse(exists);
        assertFalse(distributed);
        assertEq(total, 0);

        // Add cycle
        _addCycle1();
        (exists, distributed, total) = payroll.getCycleStatus(1);
        assertTrue(exists);
        assertFalse(distributed);
        assertEq(total, 26700 ether); // 8500 + 7200 + 11000

        // Distribute cycle
        vm.deal(address(payroll), 30000 ether);
        payroll.distributePayroll(1, 0, 2);

        (exists, distributed, total) = payroll.getCycleStatus(1);
        assertTrue(exists);
        assertTrue(distributed);
        assertEq(total, 26700 ether);
    }

    // ═══════════════════════════════════════════
    //  Test 10 — Events: PayrollAdded emitted correctly
    // ═══════════════════════════════════════════

    function test_PayrollAddedEventEmitted() public {
        address[] memory employees = new address[](2);
        employees[0] = alice;
        employees[1] = bob;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 8500 ether;
        amounts[1] = 7200 ether;

        vm.expectEmit(true, true, true, true);
        emit PayrollDistributor.PayrollAdded(1, 2, 15700 ether);

        payroll.addPayroll(employees, amounts, 1);
    }

    // ═══════════════════════════════════════════
    //  Test 11 — Events: PaymentProcessed emitted per recipient
    // ═══════════════════════════════════════════

    function test_PaymentProcessedEventsEmitted() public {
        address[] memory employees = new address[](2);
        employees[0] = alice;
        employees[1] = bob;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1 ether;
        amounts[1] = 2 ether;

        payroll.addPayroll(employees, amounts, 5);

        vm.expectEmit(true, true, true, true);
        emit PayrollDistributor.PaymentProcessed(5, alice, 1 ether, true);

        vm.expectEmit(true, true, true, true);
        emit PayrollDistributor.PaymentProcessed(5, bob, 2 ether, true);

        payroll.distributePayroll(5, 0, 1);
    }

    // ═══════════════════════════════════════════
    //  Test 12 — Events: Withdrawn emitted on successful withdraw
    // ═══════════════════════════════════════════

    function test_WithdrawnEventEmitted() public {
        _addCycle1();
        vm.deal(address(payroll), 30000 ether);
        payroll.distributePayroll(1, 0, 2);

        vm.expectEmit(true, true, true, true);
        emit PayrollDistributor.Withdrawn(alice, 8500 ether);

        vm.prank(alice);
        payroll.withdraw();
    }

    // ═══════════════════════════════════════════
    //  Test 13 — Edge case: Distribute non-existent cycle reverts
    // ═══════════════════════════════════════════

    function test_RevertDistributeNonExistentCycle() public {
        vm.expectRevert("Cycle does not exist");
        payroll.distributePayroll(999, 0, 0);
    }

    // ═══════════════════════════════════════════
    //  Test 14 — Edge case: Distribute already-distributed cycle reverts
    // ═══════════════════════════════════════════

    function test_RevertDistributeAlreadyDistributedCycle() public {
        _addCycle1();
        payroll.distributePayroll(1, 0, 2);

        vm.expectRevert("Cycle already distributed");
        payroll.distributePayroll(1, 0, 2);
    }

    // ═══════════════════════════════════════════
    //  Test 15 — Edge case: End index out of bounds
    // ═══════════════════════════════════════════

    function test_RevertEndIndexOutOfBounds() public {
        _addCycle1();

        vm.expectRevert("End index out of bounds");
        payroll.distributePayroll(1, 0, 5);
    }

    // ═══════════════════════════════════════════
    //  Test 16 — Accumulated withdrawals across multiple cycles
    // ═══════════════════════════════════════════

    function test_AccumulatedWithdrawalsAcrossCycles() public {
        // Cycle 1: Alice gets 100 ether
        address[] memory emp1 = new address[](1);
        emp1[0] = alice;
        uint256[] memory amt1 = new uint256[](1);
        amt1[0] = 100 ether;
        payroll.addPayroll(emp1, amt1, 1);
        payroll.distributePayroll(1, 0, 0);

        // Cycle 2: Alice gets 200 ether more
        address[] memory emp2 = new address[](1);
        emp2[0] = alice;
        uint256[] memory amt2 = new uint256[](1);
        amt2[0] = 200 ether;
        payroll.addPayroll(emp2, amt2, 2);
        payroll.distributePayroll(2, 0, 0);

        // Alice's pending balance should be 300
        assertEq(payroll.pendingWithdrawals(alice), 300 ether);

        // Single withdraw drains the full accumulated amount
        vm.deal(address(payroll), 300 ether);
        vm.prank(alice);
        payroll.withdraw();
        assertEq(alice.balance, 300 ether);
        assertEq(payroll.pendingWithdrawals(alice), 0);
    }
}
