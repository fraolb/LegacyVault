// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//errors
error Deposit__LowerAmountDeposited();

contract LegacyVault {
    //enums

    //variables

    //s_variables
    address payable[] private s_users;
    mapping(address => uint256) private s_userBalance;
    mapping(address => uint256) private s_userTimer;
    mapping(address => address[]) private s_userAccounts;

    //events
    event UserDeposited(address indexed user, uint256 indexed timer);
    event WithdrawSuccessful(address indexed user, uint256 indexed _amount);

    //modifiers
    modifier checkDeposit() {
        if (msg.value < 0) {
            revert Deposit__LowerAmountDeposited();
        }
        _;
    }
    //not effiecient method to use
    modifier checkUser(address user) {
        bool userExists = false;
        for (uint256 i = 0; i < s_users.length; i++) {
            if (s_users[i] == user) {
                userExists = true;
                break;
            }
        }
        require(userExists, "User not found");
        _;
    }

    //functions
    function Deposit(
        uint256 _timer,
        address[] memory _userAccounts
    ) public payable checkDeposit {
        //s_users.push(payable(msg.address));
        address User = msg.address;
        s_userBalance[msg.address] = msg.value;
        s_userTimer[msg.address] = _timer;
        if (_userAccounts.length == 0) {
            s_userAccounts[msg.address] = _userAccounts;
        }
        emit UserDeposited(msg.address, _timer);
    }

    function Withdraw(uint256 _amount) public {
        uint256 amount = s_userBalance[msg.sender];
        require(amount >= _amount, "Insufficient balance");

        // Remove the user from the array
        if (amount == _amount) {
            delete s_userBalance[msg.sender];
            delete s_userTimer[msg.sender];
            delete s_userAccounts[msg.sender];
            /*
            for (uint256 i = 0; i < s_users.length; i++) {
                if (s_users[i] == msg.sender) {
                    s_users[i] = s_users[s_users.length - 1];
                    s_users.pop();
                    break;
                }
            }
            */
        } else {
            s_userBalance[msg.sender] -= _amount;
        }

        emit WithdrawSuccessful(msg.sender, _amount);
    }

    function DistributeUsersMoney() public {}
}
