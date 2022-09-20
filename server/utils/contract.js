//Get contract json from parent project
const fs = require("fs");
const path = require("path");
const { web3, sendTransaction } = require("./eth");

function getContract(name) {
    let projectPath = path.join(__dirname, "..");
    let contractPath = path.join(
        projectPath,
        "..",
        "build",
        "contracts",
        name + ".json"
    );
    let contract = JSON.parse(fs.readFileSync(contractPath));
    return contract;
}

function setAddressInContractJson(name, address) {
    let projectPath = path.join(__dirname, "..");
    let contractPath = path.join(
        projectPath,
        "..",
        "build",
        "contracts",
        name + ".json"
    );
    let contract = JSON.parse(fs.readFileSync(contractPath));
    contract.address = address;
    fs.writeFileSync(contractPath, JSON.stringify(contract, null, 2));
}

function deployContracts() {
    return new Promise((resolve, reject) => {
        let UTILS_CONTRACT = getContract("Utils");
        let VOTE_FAUCET_CONTRACT = getContract("VoteFaucet");
        let OPERATORS_CONTRACT = getContract("Operators");

        if (!UTILS_CONTRACT || !UTILS_CONTRACT || !UTILS_CONTRACT) {
            console.log("Contracts not found");
            return;
        }

        let operators = new web3.eth.Contract(OPERATORS_CONTRACT.abi);
        let voteFaucet = new web3.eth.Contract(VOTE_FAUCET_CONTRACT.abi);
        let utils = new web3.eth.Contract(UTILS_CONTRACT.abi);

        let myOperators = operators.deploy({
            data: OPERATORS_CONTRACT.bytecode,
        });

        sendTransaction(myOperators).then((opReceipt) => {
            console.log("Operators deployed at: " + opReceipt.contractAddress);
            setAddressInContractJson("Operators", opReceipt.contractAddress);
            let myVoteFaucet = voteFaucet.deploy({
                data: VOTE_FAUCET_CONTRACT.bytecode,
                arguments: [opReceipt.contractAddress],
            });

            sendTransaction(myVoteFaucet).then((vfReceipt) => {
                console.log(
                    "VoteFaucet deployed at: " + vfReceipt.contractAddress
                );
                setAddressInContractJson(
                    "VoteFaucet",
                    vfReceipt.contractAddress
                );
                let myUtils = utils.deploy({
                    data: UTILS_CONTRACT.bytecode,
                    arguments: [
                        vfReceipt.contractAddress,
                        opReceipt.contractAddress,
                    ],
                });

                sendTransaction(myUtils).then((uReceipt) => {
                    console.log(
                        "Utils deployed at: " + uReceipt.contractAddress
                    );
                    setAddressInContractJson("Utils", uReceipt.contractAddress);
                    resolve([
                        opReceipt.contractAddress,
                        vfReceipt.contractAddress,
                        uReceipt.contractAddress,
                    ]);
                });
            });
        });
    });
}

module.exports = { getContract, deployContracts };
