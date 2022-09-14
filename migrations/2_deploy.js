const Operators = artifacts.require("Operators");
const VoteFaucet = artifacts.require("VoteFaucet");
const Utils = artifacts.require("Utils");
//For updating the contract json file
const fs = require("fs");
const path = require("path");

function setContractAddress(contractName, contractData, network) {
    const contractPath = path.resolve(
        __dirname,
        "../build/contracts",
        contractName + ".json"
    );
    const clientPath = path.resolve(
        __dirname,
        "../client/src/abis",
        contractName + ".json"
    );
    const contract = JSON.parse(fs.readFileSync(contractPath));
    contract.networks[network] = {
        events: {},
        links: {},
        address: contractData.address,
        transactionHash: contractData.transactionHash,
    };
    fs.writeFileSync(contractPath, JSON.stringify(contract, null, 2));
    fs.writeFileSync(clientPath, JSON.stringify(contract, null, 2));
}

module.exports = async function (deployer, network) {
    deployer.deploy(Operators).then((operators) => {
        setContractAddress("Operators", operators, network);
        console.log("Operators deployed at: " + operators.address);
        deployer
            .deploy(VoteFaucet, operators.address)
            .then((voteFaucet) => {
                setContractAddress("VoteFaucet", voteFaucet, network);
                console.log("VoteFaucet deployed at: " + voteFaucet.address);
                deployer
                    .deploy(Utils, voteFaucet.address, operators.address)
                    .then((utils) => {
                        setContractAddress("Utils", utils, network);
                        console.log("Utils deployed at: " + utils.address);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    });
};
