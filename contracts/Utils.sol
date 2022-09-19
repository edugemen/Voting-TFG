// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.14;

import "./Owned.sol";
import "./VoteFaucet.sol";
import "./Party.sol";
import "./Operators.sol";
import "./Ballot.sol";

contract Utils {
    //Turns address to dni and viceversa
    mapping(address => uint32) private addressToDni;
    mapping(uint32 => address) private dniToAddress;

    //Mapping that stores the party of each person
    mapping(address => address) private inParty;
    mapping(address => address[]) private userParties;

    //Mapping that stores when a person joined or left a party
    mapping(address => uint256) private userPartyUpdate;
    mapping(address => uint256) private partyLastVote;

    mapping(address => bool) private isParty;
    mapping(address => bool) private isBallot;

    VoteFaucet voteFaucet;
    Operators operators;

    //----------------------CONSTRUCTOR-----------------------

    constructor(address payable _voteFaucet, address _operators) {
        operators = Operators(_operators);
        require(
            operators.isOwner(msg.sender),
            "Only an owner can call this function"
        );
        voteFaucet = VoteFaucet(_voteFaucet);
        voteFaucet.setUtils(msg.sender);
    }

    //-----------------------FUNCTIONS------------------------

    function secureRegister(
        uint8 v,
        bytes32 r,
        bytes32 s,
        address payable sender,
        uint32 dni
    ) public {
        require(operators.isOwner(msg.sender));
        require(addressToDni[sender] == 0, "You are already registered");
        require(dniToAddress[dni] == address(0), "DNI already registered");

        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        bytes32 eip712DomainHash = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("newUser")),
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );

        bytes32 hashStruct = keccak256(
            abi.encode(
                keccak256("secureRegister(address sender,uint dni)"),
                sender,
                dni
            )
        );

        bytes32 hash = keccak256(
            abi.encodePacked("\x19\x01", eip712DomainHash, hashStruct)
        );

        address signer = ecrecover(hash, v, r, s);
        require(signer != address(0), "ECDSA: invalid signature");
        require(signer == sender, "Register: invalid signature");

        addressToDni[sender] = dni;
        dniToAddress[dni] = sender;

        voteFaucet.registerPay(sender);
    }

    function changeParty(address _newParty) public {
        require(
            inParty[msg.sender] != _newParty,
            "You are already in this party"
        );

        address oldPartyAddress = inParty[msg.sender];

        if (oldPartyAddress != address(0)) {
            require(
                partyLastVote[oldPartyAddress] + 1 days < block.timestamp,
                "You can't leave a party, the party has just voted"
            );
            Party oldParty = Party(oldPartyAddress);
            oldParty.decreaseMembers();
        }

        if (_newParty != address(0)) {
            require(isParty[_newParty], "Invalid party");
            Party newParty = Party(_newParty);
            newParty.increaseMembers();
        }

        inParty[msg.sender] = _newParty;
        userPartyUpdate[msg.sender] = block.timestamp;
    }

    function addPartyToMapping(address _party, address _owner) public {
        require(!isParty[_party], "Party already in mapping");
        require(isRegistered(_owner), "Owner not registered");
        isParty[_party] = true;
    }

    function addBallotToMapping(address _ballot, address _owner) public {
        require(!isBallot[_ballot], "Ballot already in mapping");
        require(isRegistered(_owner), "Owner not registered");
        isBallot[_ballot] = true;
    }

    function addPartyToUser(address _user) public {
        require(isParty[msg.sender], "Invalid party");
        require(isRegistered(_user), "User not registered");
        userParties[_user].push(msg.sender);
    }

    function removePartyFromUser(address _user) public {
        require(isParty[msg.sender], "Invalid party");
        require(isRegistered(_user), "User not registered");
        for (uint256 i = 0; i < userParties[_user].length; i++) {
            if (userParties[_user][i] == msg.sender) {
                userParties[_user][i] = userParties[_user][
                    userParties[_user].length - 1
                ];
                userParties[_user].pop();
                break;
            }
        }
    }

    function getParties() public view returns (address[] memory) {
        return userParties[msg.sender];
    }

    //Check if dni and address correspond to each other
    function checkDniAddress(uint32 _dni, address _address)
        public
        view
        returns (bool)
    {
        return dniToAddress[_dni] == _address;
    }

    //Check if person is registered
    function isRegistered(address _address) public view returns (bool) {
        return addressToDni[_address] != 0;
    }

    //Check users party
    function checkParty(address _user) public view returns (address) {
        require(checkIsBallot(msg.sender), "You are not a ballot");
        return inParty[_user];
    }

    function checkIsParty(address _sender) public view returns (bool) {
        return isParty[_sender];
    }

    function checkIsBallot(address _sender) public view returns (bool) {
        return isBallot[_sender];
    }

    function setLastVote() public {
        require(isParty[msg.sender], "Not a party");
        partyLastVote[msg.sender] = block.timestamp;
    }

    function getLastPartyUpdate(address _user) public view returns (uint256) {
        require(isBallot[msg.sender], "Not a ballot");
        return userPartyUpdate[_user];
    }

    function getPartyIn() public view returns (address) {
        return inParty[msg.sender];
    }
}
