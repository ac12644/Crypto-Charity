// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
    struct Donation {
        uint256 value;
        uint256 date;
    }

    mapping(address => Donation[]) private donations;

    event DonationReceived(address indexed donor, uint256 value);
    event Withdraw(uint256 amount);

    string public name;
    string public image;
    string public description;
    address payable public beneficiary;
    uint256 public goalAmount;
    uint256 public totalDonations;
    uint256 public donationsCount;

    constructor(
        string memory _name,
        string memory _image,
        string memory _description,
        uint256 _goalAmount,
        address payable _beneficiary,
        address _custodian
    ) {
        name = _name;
        image = _image;
        description = _description;
        goalAmount = _goalAmount;
        beneficiary = _beneficiary;
        transferOwnership(_custodian);
    }

    function setBeneficiary(address payable _beneficiary) external onlyOwner {
        beneficiary = _beneficiary;
    }

    function myDonationsCount() external view returns (uint256) {
        return donations[msg.sender].length;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation amount must be greater than zero");
        donations[msg.sender].push(Donation({
            value: msg.value,
            date: block.timestamp
        }));
        totalDonations += msg.value;
        donationsCount++;

        emit DonationReceived(msg.sender, msg.value);
    }

    function myDonations() external view returns (uint256[] memory values, uint256[] memory dates) {
        uint256 count = donations[msg.sender].length;
        values = new uint256[](count);
        dates = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            Donation storage donation = donations[msg.sender][i];
            values[i] = donation.value;
            dates[i] = donation.date;
        }

        return (values, dates);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Insufficient balance to withdraw");
        (bool success, ) = beneficiary.call{value: balance}("");
        require(success, "Withdrawal failed");

        emit Withdraw(balance);
    }

    fallback() external payable {
        donate();
    }
}
