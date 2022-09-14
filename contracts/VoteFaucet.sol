// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.14;

import "./Utils.sol";
import "./Operators.sol";

contract VoteFaucet {
    uint256 public registerAmount = 10;
    uint256 public rechargeAmount = 5;
    uint256 public rechargeThreshold = 1;
    uint256 private multiplier = 1000000000000000000;

    mapping(address => uint256) private lastTransfer;

    Utils utils;
    Operators operators;

    modifier enoughBalance() {
        require(
            address(this).balance >= registerAmount * multiplier,
            "Not enough balance"
        );
        _;
    }

    constructor(address _operators) {
        operators = Operators(_operators);
    }

    function setUtils(address _sender) public {
        require(operators.isOwner(_sender));
        utils = Utils(msg.sender);
    }

    function registerPay(address payable _address) public enoughBalance {
        require(
            address(utils) == msg.sender,
            "Only utils contract can call this function"
        );
        _address.transfer(registerAmount * multiplier);
        lastTransfer[_address] = block.timestamp;
    }

    function recharge(address payable _address) public enoughBalance {
        require(
            lastTransfer[_address] + 1 days < block.timestamp,
            "You can only recharge once per day"
        );
        require(
            _address.balance < rechargeThreshold * multiplier,
            "You must have less than 1 VOTE"
        );
        _address.transfer(rechargeAmount * multiplier);
    }

    function getFaucetBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
