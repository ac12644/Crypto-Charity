// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract Fundraiser is Ownable {
  using SafeMath for uint256;

  struct Donation {
    uint256 value;
    uint256 date;
  }
  mapping(address => Donation[]) private _donations;

  event DonationReceived(address indexed donor, uint256 value);
  event Withdraw(uint256 amount);

  string public name;
  string public linkToCompany;
  string public images;
  string public description;
  string public about;

  address payable public beneficiary;

  uint256 public totalDonations;
  uint256 public donationsCount;

  constructor(
    string memory _name,
    string memory _linkToCompany,
    string memory _images,
    string memory _description,
    string memory _about,
    address payable _beneficiary,
    address _custodian
  ) public {
    name = _name;
    linkToCompany = _linkToCompany;
    images = _images;
    description = _description;
    about = _about;
    beneficiary = _beneficiary;
    _transferOwnership(_custodian);
  }

  function setBeneficiary(address payable _beneficiary) public onlyOwner {
    beneficiary = _beneficiary;
  }

  function myDonationsCount() public view returns (uint256) {
    return _donations[msg.sender].length;
  }

  function donate() public payable {
    Donation memory donation = Donation({
      value: msg.value,
      date: block.timestamp
    });
    _donations[msg.sender].push(donation);
    totalDonations = totalDonations.add(msg.value);
    donationsCount++;

    emit DonationReceived(msg.sender, msg.value);
  }

  function myDonations()
    public
    view
    returns (uint256[] memory values, uint256[] memory dates)
  {
    uint256 count = myDonationsCount();
    values = new uint256[](count);
    dates = new uint256[](count);

    for (uint256 i = 0; i < count; i++) {
      Donation storage donation = _donations[msg.sender][i];
      values[i] = donation.value;
      dates[i] = donation.date;
    }
    return (values, dates);
  }

  function withdraw() public onlyOwner {
    uint256 balance = address(this).balance;
    beneficiary.transfer(balance);
    emit Withdraw(balance);
  }

  fallback() external payable {
    totalDonations = totalDonations.add(msg.value);
    donationsCount++;
  }
}
