// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSend {
    event FundsReceived(address indexed sender, uint256 amount);
    event FundsSent(address indexed recipient, uint256 amount);

    function multiSend(address[] memory _recipients) external payable {
        require(_recipients.length > 0, "No recipients provided");
        require(msg.value > 0, "No value sent");

        uint256 totalAmount = msg.value;
        uint256 amountPerRecipient = totalAmount / _recipients.length;

        for (uint256 i = 0; i < _recipients.length; i++) {
            payable(_recipients[i]).transfer(amountPerRecipient);
            emit FundsSent(_recipients[i], amountPerRecipient);
        }
    }

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }
}
