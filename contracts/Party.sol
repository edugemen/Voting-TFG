// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.14;

import "./Ballot.sol";
import "./Utils.sol";
import "./Owned.sol";

contract Party is Owned {
    //Party attributes
    string public name;
    string public description;
    string public image;
    string public website;
    string public email;
    string public electoralProgram;
    uint256 public numberOfMembers;

    Utils utils;

    modifier isUtils() {
        require(address(utils) == msg.sender);
        _;
    }

    modifier isBallot() {
        require(utils.checkIsBallot(msg.sender), "Invalid ballot");
        _;
    }

    constructor(
        address _utils,
        string memory _name,
        string memory _description
    ) {
        name = _name;
        description = _description;
        utils = Utils(_utils);
        utils.addPartyToMapping(address(this), msg.sender);
        utils.addPartyToUser(msg.sender);
    }

    function addOwner(address _addr) public override onlyOwner {
        super.addOwner(_addr);
        utils.addPartyToUser(_addr);
    }

    function removeOwner(address _addr) public override onlyOwner {
        super.removeOwner(_addr);
        utils.removePartyFromUser(_addr);
    }

    function partyVote(address ballot, uint8 option) public onlyOwner {
        Ballot b = Ballot(ballot);
        b.partyVote(option);
        utils.setLastVote();
    }

    function set(string[] memory _fields, uint8[] memory ids) public onlyOwner {
        for (uint8 i = 0; i < _fields.length; i++) {
            if (ids[i] == 0) {
                name = _fields[i];
            } else if (ids[i] == 1) {
                description = _fields[i];
            } else if (ids[i] == 2) {
                image = _fields[i];
            } else if (ids[i] == 3) {
                website = _fields[i];
            } else if (ids[i] == 4) {
                email = _fields[i];
            } else if (ids[i] == 5) {
                electoralProgram = _fields[i];
            }
        }
    }

    function imOwner() public view returns (bool) {
        return owned[msg.sender];
    }

    //Setters
    function increaseMembers() public isUtils {
        numberOfMembers++;
    }

    function decreaseMembers() public isUtils {
        numberOfMembers--;
    }
}
