// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//imports
import "./QuickSort.sol";
import "hardhat/console.sol";

//errors
error Deposit__LowerAmountDeposited();
error Deposit__UserAlreadyDeposited();
error Deposit__TimerNotSpecified();

contract LegacyVault {
    //enums
    struct DepositStruct {
        address user;
        uint256 amount;
        uint256 timer;
        address[] distributeAccounts;
    }

    //variables

    //s_variables
    mapping(address => uint256) private s_userBalance;
    mapping(address => uint256) private s_userTimer;
    mapping(address => address[]) private s_userAccounts;

    mapping(uint256 => address[]) private s_timerCheck;
    mapping(address => DepositStruct[]) private s_userData;
    uint[] private timers;

    //events
    event UserDeposited(address indexed user, uint256 indexed timer);
    event WithdrawSuccessful(address indexed user, uint256 indexed _amount);

    //modifiers
    modifier checkDeposit() {
        if (s_userData[msg.sender].length != 0) {
            revert Deposit__UserAlreadyDeposited();
        }
        if (msg.value <= 0) {
            revert Deposit__LowerAmountDeposited();
        }
        _;
    }

    modifier checkUser() {
        require(s_userData[msg.sender].length > 0, "User not found");
        _;
    }

    QuickSort public quickSortContract;

    // Constructor to initialize the QuickSort contract
    constructor() {
        quickSortContract = new QuickSort();
    }

    //functions
    function Deposit(
        uint256 _timer,
        address[] memory _userAccounts
    ) public payable checkDeposit {
        require(_timer != 0, "Timer is required!");
        // s_userBalance[msg.sender] = msg.value;
        // s_userTimer[msg.sender] = _timer;
        address[] memory accounts = (_userAccounts.length == 0)
            ? new address[](1)
            : _userAccounts;
        if (_userAccounts.length == 0) {
            accounts[0] = msg.sender;
        }

        DepositStruct memory i = DepositStruct(
            msg.sender,
            msg.value,
            _timer,
            accounts
        );
        s_userData[msg.sender].push(i);

        if (s_timerCheck[_timer].length < 1) {
            timers.push(_timer);
            timers = quickSortContract.sort(timers);
        }
        s_timerCheck[_timer].push(msg.sender);

        emit UserDeposited(msg.sender, _timer);
    }

    function Withdraw() public checkUser {
        DepositStruct memory i = s_userData[msg.sender][0];
        uint256 amount = i.amount;
        uint256 time = i.timer;
        address[] memory timerCheck = s_timerCheck[time];

        if (timerCheck.length == 1) {
            uint[] memory newTimers = new uint[](timers.length - 1);
            uint256 count = 0;

            for (uint k = 0; k < timers.length; k++) {
                if (timers[k] != time) {
                    newTimers[count] = timers[k];
                    count++;
                }
            }
            timers = newTimers;
            delete s_timerCheck[time];
        } else {
            address[] memory addresses = s_timerCheck[time];
            address[] memory newAddresses = new address[](addresses.length - 1);
            uint256 count = 0;

            for (uint j = 0; j < addresses.length; j++) {
                if (addresses[j] != msg.sender) {
                    newAddresses[count] = addresses[j];
                    count++;
                }
            }

            s_timerCheck[time] = newAddresses;
        }

        delete s_userData[msg.sender];
        payable(msg.sender).transfer(amount);

        emit WithdrawSuccessful(msg.sender, amount);
    }

    function DistributeUsersMoney() public {
        ///take data from timer which ones are going to be withdrawn
        uint[] memory time = new uint[](timers.length);
        uint256 count = 0;
        console.log("test 1 - entered function");

        for (uint l = 0; l <= timers.length; l++) {
            if (timers[l] <= block.timestamp) {
                time[count] = timers[l];
                count++;
                console.log("loop entered count ", count);
            } else {
                break;
            }
        }
        //new Timer is going to be time stamps that are going to be distributed
        if (count != 0) {
            console.log("count > 0, entered function");
            uint[] memory newTime = new uint[](count);
            for (uint i = 0; i < count; i++) {
                newTime[i] = time[i];
            }

            uint timerLength = timers.length - count;
            uint timerCount = 0;
            uint[] memory newTimers = new uint[](timerLength);
            uint[] memory newEmptyTimers = new uint[](0);

            if (timerLength != 0) {
                for (uint j = count; j < timers.length; j++) {
                    newTimers[timerCount] = timers[j];
                    timerCount++;
                }
                // the remaining time is stored in the timers
                timers = newTimers;
            } else {
                timers = newEmptyTimers;
            }

            /// distribute to the user accounts
            for (uint m = 0; m < newTime.length; m++) {
                DistributeEach(newTime[m]);
            }
        }
    }

    function DistributeEach(uint _time) internal {
        address[] memory Owners = s_timerCheck[_time];

        for (uint i = 0; i < Owners.length; i++) {
            DepositStruct[] memory userData = s_userData[Owners[i]];
            address[] memory accounts = userData[0].distributeAccounts;
            uint256 amount = userData[0].amount / accounts.length;

            for (uint j = 0; j < accounts.length; j++) {
                payable(accounts[j]).transfer(amount);
            }

            delete s_userData[Owners[i]];
        }

        delete s_timerCheck[_time];
    }

    /// view pure functions
    function getTimerData() public view returns (uint256[] memory) {
        return timers;
    }

    function getUserData(
        address _user
    ) public view returns (DepositStruct memory) {
        return s_userData[_user][0];
    }

    function checkTimerAddresses(
        uint256 _time
    ) public view returns (address[] memory) {
        return s_timerCheck[_time];
    }

    function getContractValue() public view returns (uint256) {
        return address(this).balance;
    }

    //["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"]
}
