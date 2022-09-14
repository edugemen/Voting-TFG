// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.14;

import "./Utils.sol";
import "./Party.sol";
import "./Owned.sol";

//import "./Storage.sol";

contract Ballot is Owned {
    //Attributes
    uint256 creationTimestamp;
    string question;
    string[] public options;
    uint256[] votes;
    uint256[] periods = [5, 6, 7, 10];

    mapping(address => uint8) hasVoted;

    Utils utils;

    //Ballot show
    struct BallotData {
        string question;
        string[] options;
        uint8 state;
        uint256 untilNextState;
    }

    struct PartyVote {
        uint256 timestamp;
        uint8 option;
    }

    mapping(address => PartyVote) votedParties;

    //----------------------STATE LOGIC-----------------------

    /*
        States:
        0 - Ballot present
        1 - Party voting
        2 - General voting
        3 - Closed
    */

    modifier inState(uint8 _state) {
        require(
            _state <= 3 &&
                block.timestamp <
                creationTimestamp + (periods[_state] * 1 minutes)
        );
        _;
    }

    //------------------------MODIFIER------------------------

    //Modifier check if sender is contract Party
    modifier isParty() {
        require(utils.checkIsParty(msg.sender), "Invalid party");
        _;
    }

    //----------------------CONSTRUCTOR-----------------------

    constructor(
        string memory _question,
        string[] memory _options,
        address _utils
    ) {
        question = _question;
        options = _options;
        votes = new uint256[](options.length);
        creationTimestamp = block.timestamp;
        utils = Utils(_utils);
        utils.addBallotToMapping(address(this), msg.sender);
    }

    //-------------------SECURE FUNCTIONS---------------------

    function vote(uint256 option) public inState(2) {
        require(option < options.length, "Option out of range");
        require(utils.isRegistered(msg.sender), "You are not registered");
        require(hasVoted[msg.sender] == 0, "You have already voted");

        uint256 partyUpdate = utils.getLastPartyUpdate(msg.sender);
        require(
            partyUpdate < creationTimestamp + (periods[0] * 1 minutes),
            "You changed your party at voting time"
        );

        address party = utils.checkParty(msg.sender);

        if (party != address(0)) {
            votes[getPartyVote(party)]--;
        }

        hasVoted[msg.sender] = 1;
        votes[option]++;
    }

    function partyVote(uint8 option) public inState(1) isParty {
        require(option < options.length, "Option out of range");
        require(hasVoted[msg.sender] == 0, "You have already voted");

        votedParties[msg.sender] = PartyVote(block.timestamp, option);
        hasVoted[msg.sender] = 1;
        votes[option] += Party(msg.sender).numberOfMembers();
    }

    //---------------------PRIVATE FUNCTIONS---------------------

    function getPartyVote(address party) internal view returns (uint256) {
        return votedParties[party].option;
    }

    //----------------------PUBLIC FUNCTIONS---------------------

    function setPeriods(uint256[] memory _periods) public onlyOwner {
        require(_periods.length == 4, "Invalid number of periods");
        periods = _periods;
    }

    function getPartyVotes(address[] memory parties)
        public
        view
        returns (int8[] memory)
    {
        int8[] memory result = new int8[](parties.length);
        for (uint256 i = 0; i < parties.length; i++) {
            PartyVote memory pv = votedParties[parties[i]];
            if (pv.timestamp == 0) {
                result[i] = -1;
            } else {
                result[i] = int8(pv.option);
            }
        }
        return result;
    }

    function getState() public view returns (uint8) {
        for (uint8 i = 0; i < periods.length; i++) {
            if (
                block.timestamp < creationTimestamp + (periods[i] * 1 minutes)
            ) {
                return i;
            }
        }
        return 3;
    }

    function untilNextState() public view returns (uint256) {
        uint256 state = getState();
        if (state < 3) {
            return
                creationTimestamp +
                (periods[state] * 1 minutes) -
                block.timestamp;
        } else {
            return 1000000;
        }
    }

    function getData() public view returns (BallotData memory) {
        return BallotData(question, options, getState(), untilNextState());
    }

    function getVotes() public view returns (uint256[] memory) {
        return votes;
    }
}
