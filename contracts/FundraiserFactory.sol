// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Fundraiser.sol";

contract FundraiserFactory {
    uint256 public constant MAX_LIMIT = 20;
    Fundraiser[] private fundraisers;

    event FundraiserCreated(Fundraiser indexed fundraiser, address indexed owner);

    function createFundraiser(
        string memory name,
        string memory image,
        string memory description,
        uint256 goalAmount,
        address payable beneficiary
    ) external {
        Fundraiser fundraiser = new Fundraiser(
            name,
            image,
            description,
            goalAmount,
            beneficiary,
            msg.sender
        );
        fundraisers.push(fundraiser);
        emit FundraiserCreated(fundraiser, msg.sender);
    }

    function fundraisersCount() external view returns (uint256) {
        return fundraisers.length;
    }

    function getFundraisers(uint256 limit, uint256 offset) external view returns (Fundraiser[] memory) {
        require(offset <= fundraisers.length, "Offset out of bounds");
        
        uint256 size = fundraisers.length - offset;
        size = size < limit ? size : limit;
        size = size < MAX_LIMIT ? size : MAX_LIMIT;

        Fundraiser[] memory coll = new Fundraiser[](size);
        for (uint256 i = 0; i < size; i++) {
            coll[i] = fundraisers[offset + i];
        }

        return coll;
    }
}
