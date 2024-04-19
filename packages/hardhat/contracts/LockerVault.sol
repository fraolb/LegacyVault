// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//errors
error Deposit__LowerAmountDeposited();
error Deposit__UserAlreadyDeposited();
error Deposit__TimerNotSpecified();

contract LegacyVault {
    //enums

    //variables

    //s_variables
    mapping(address => uint256) private s_userBalance;
    mapping(address => uint256) private s_userTimer;
    mapping(address => address[]) private s_userAccounts;
    mapping(uint256 => address[]) private s_timerCheck;

    uint[] private timers;

    //events
    event UserDeposited(address indexed user, uint256 indexed timer);
    event WithdrawSuccessful(address indexed user, uint256 indexed _amount);

    //modifiers
    modifier checkDeposit(uint256 _timer) {
        if (s_userBalance[msg.sender] != 0) {
            revert Deposit__UserAlreadyDeposited();
        }
        if (_timer == 0) {
            revert Deposit__TimerNotSpecified();
        }
        if (msg.value < 0) {
            revert Deposit__LowerAmountDeposited();
        }
        _;
    }

    modifier checkUser() {
        bool userExists = (s_userBalance[msg.sender] != 0);

        require(userExists, "User not found");
        _;
    }

    //functions
    function Deposit(
        uint256 _timer,
        address[] memory _userAccounts
    ) public payable checkDeposit(_timer) {
        s_userBalance[msg.sender] = msg.value;
        s_userTimer[msg.sender] = _timer;
        timers.push(_timer);
        if (_userAccounts.length == 0) {
            s_userAccounts[msg.sender] = [msg.sender];
        } else {
            s_userAccounts[msg.sender] = _userAccounts;
        }
        emit UserDeposited(msg.sender, _timer);
    }

    function Withdraw() public checkUser {
        uint256 amount = s_userBalance[msg.sender];

        delete s_userBalance[msg.sender];
        delete s_userTimer[msg.sender];
        delete s_userAccounts[msg.sender];

        emit WithdrawSuccessful(msg.sender, amount);
    }

    function DistributeUsersMoney() public {
        for (uint i = 0; i < timers.length; i++) {
            if (timers[i] <= block.number) {
                address[] memory vals = s_timerCheck[timers[i]];
                for (uint j = 0; j < vals.length; j++) {
                    uint256 balance = s_userBalance[vals[j]];
                    address[] memory accounts = s_userAccounts[vals[j]];
                    //uint256 userTimer = s_userTimer[vals[j]];
                    delete s_userBalance[vals[j]];
                    delete s_userTimer[vals[j]];
                }

                timers[i] = 0; // Reset the timer value
            }
        }
    }
}
