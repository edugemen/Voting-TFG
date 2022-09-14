// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.14;

import "./Owned.sol";

contract Operators is Owned {
    function isOwner(address _addr) public view returns (bool) {
        return owned[_addr];
    }
}
