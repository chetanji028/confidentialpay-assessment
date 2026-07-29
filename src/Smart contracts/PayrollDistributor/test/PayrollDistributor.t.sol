// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/PayrollDistributor.sol";

contract RejectingReceiver {
    receive() external payable { revert("reject payment"); }
}

contract PayrollDistributorTest is Test {
    PayrollDistributor private payroll;
    address private alice = address(0xA11CE);
    address private bob = address(0xB0B);
    address private carol = address(0xCA101);
    address private nonOwner = address(0xBEEF);

    function setUp() public { payroll = new PayrollDistributor(); }

    function _addCycle(uint256 cycleId) private {
        address[] memory employees = new address[](3);
        employees[0] = alice; employees[1] = bob; employees[2] = carol;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1 ether; amounts[1] = 2 ether; amounts[2] = 3 ether;
        payroll.addPayroll(employees, amounts, cycleId);
    }

    function test_AddAndDistributeHappyPath() public {
        _addCycle(1);
        vm.deal(address(payroll), 6 ether);
        assertEq(payroll.distributePayroll(1, 0, 2), 3);
        assertEq(alice.balance, 1 ether);
        assertEq(bob.balance, 2 ether);
        assertEq(carol.balance, 3 ether);
        (, bool distributed, uint256 total) = payroll.getCycleStatus(1);
        assertTrue(distributed);
        assertEq(total, 6 ether);
    }

    function test_RevertForDuplicateCycle() public {
        _addCycle(1);
        vm.expectRevert("Cycle already exists");
        _addCycle(1);
    }

    function test_RevertForMismatchedArrays() public {
        address[] memory employees = new address[](1);
        uint256[] memory amounts = new uint256[](0);
        vm.expectRevert("Array length mismatch");
        payroll.addPayroll(employees, amounts, 1);
    }

    function test_RevertForEmptyPayroll() public {
        address[] memory employees = new address[](0);
        uint256[] memory amounts = new uint256[](0);
        vm.expectRevert("Empty payroll");
        payroll.addPayroll(employees, amounts, 1);
    }

    function test_NonOwnerCannotAddOrDistribute() public {
        address[] memory employees = new address[](1); employees[0] = alice;
        uint256[] memory amounts = new uint256[](1); amounts[0] = 1 ether;
        vm.prank(nonOwner); vm.expectRevert(); payroll.addPayroll(employees, amounts, 1);
        _addCycle(1);
        vm.prank(nonOwner); vm.expectRevert(); payroll.distributePayroll(1, 0, 2);
    }

    function test_InsufficientBalanceSkipsAndCanBeRetried() public {
        _addCycle(1);
        vm.deal(address(payroll), 1 ether);
        assertEq(payroll.distributePayroll(1, 0, 2), 1);
        assertEq(alice.balance, 1 ether);
        assertFalse(payroll.paymentCompleted(1, 1));
        vm.deal(address(payroll), 5 ether);
        assertEq(payroll.distributePayroll(1, 0, 2), 2);
        (, bool distributed,) = payroll.getCycleStatus(1);
        assertTrue(distributed);
    }

    function test_PartialRangesDoNotDuplicatePayments() public {
        _addCycle(1);
        vm.deal(address(payroll), 6 ether);
        payroll.distributePayroll(1, 0, 0);
        assertEq(alice.balance, 1 ether);
        assertEq(payroll.distributePayroll(1, 0, 2), 2);
        assertEq(alice.balance, 1 ether);
        assertEq(bob.balance, 2 ether);
        assertEq(carol.balance, 3 ether);
    }

    function test_RejectingRecipientDoesNotBlockBatch() public {
        RejectingReceiver rejecting = new RejectingReceiver();
        address[] memory employees = new address[](2); employees[0] = address(rejecting); employees[1] = alice;
        uint256[] memory amounts = new uint256[](2); amounts[0] = 1 ether; amounts[1] = 2 ether;
        payroll.addPayroll(employees, amounts, 1);
        vm.deal(address(payroll), 3 ether);
        assertEq(payroll.distributePayroll(1, 0, 1), 1);
        assertFalse(payroll.paymentCompleted(1, 0));
        assertEq(alice.balance, 2 ether);
    }

    function test_EventsAndStatus() public {
        address[] memory employees = new address[](1); employees[0] = alice;
        uint256[] memory amounts = new uint256[](1); amounts[0] = 1 ether;
        vm.expectEmit(true, false, false, true);
        emit PayrollDistributor.PayrollAdded(7, 1, 1 ether);
        payroll.addPayroll(employees, amounts, 7);
        vm.deal(address(payroll), 1 ether);
        vm.expectEmit(true, true, false, true);
        emit PayrollDistributor.PaymentProcessed(7, alice, 1 ether, true);
        payroll.distributePayroll(7, 0, 0);
        (bool exists, bool distributed, uint256 total) = payroll.getCycleStatus(7);
        assertTrue(exists); assertTrue(distributed); assertEq(total, 1 ether);
    }

    function test_InvalidRecipientAndBoundsRevert() public {
        address[] memory employees = new address[](1); employees[0] = address(0);
        uint256[] memory amounts = new uint256[](1); amounts[0] = 1 ether;
        vm.expectRevert("Invalid recipient"); payroll.addPayroll(employees, amounts, 1);
        _addCycle(2);
        vm.expectRevert("End index out of bounds"); payroll.distributePayroll(2, 0, 3);
    }
}
