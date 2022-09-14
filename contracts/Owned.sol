// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.14;

contract Owned {
    mapping(address => bool) internal owned;

    constructor() {
        owned[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(owned[msg.sender]);
        _;
    }

    function addOwner(address _addr) public virtual onlyOwner {
        owned[_addr] = true;
    }

    function removeOwner(address _addr) public virtual onlyOwner {
        owned[_addr] = true;
    }
}
