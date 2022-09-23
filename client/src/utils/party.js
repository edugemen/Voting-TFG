import { getWeb3 } from "./metamask";

import Utils from "../abis/Utils.json";
import Party from "../abis/Party.json";
import Ballot from "../abis/Ballot.json";
import { utilsContractAddress } from "./auth";

export function createParty(_name, _description) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let userAddress = (await web3.eth.getAccounts())[0];
        let partyContract = new web3.eth.Contract(Party.abi);
        partyContract
            .deploy({
                data: Party.bytecode,
                arguments: [utilsContractAddress, _name, _description],
            })
            .send({ from: userAddress, gas: "3000000" })
            .then((result) => {
                resolve(result);
            })
            .then((receipt) => {
                resolve(receipt);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function checkPartyOwner(_partyAddress) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let userAddress = (await web3.eth.getAccounts())[0];
        let partyContract = new web3.eth.Contract(Party.abi, _partyAddress);
        partyContract.methods
            .imOwner()
            .call({ from: userAddress })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export async function getParty(_id) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let partyContract = new web3.eth.Contract(Party.abi, _id);
        let party = {
            address: _id,
            name: await partyContract.methods.name().call(),
            description: await partyContract.methods.description().call(),
            image: await partyContract.methods.image().call(),
            website: await partyContract.methods.website().call(),
            email: await partyContract.methods.email().call(),
            electoralProgram: await partyContract.methods
                .electoralProgram()
                .call(),
            numberOfMembers: await partyContract.methods
                .numberOfMembers()
                .call(),
        };
        resolve(party);
    });
}

export function getPartiesFromUser() {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let userAddress = (await web3.eth.getAccounts())[0];
        let utilsContract = new web3.eth.Contract(
            Utils.abi,
            utilsContractAddress
        );
        utilsContract.methods
            .getParties()
            .call({ from: userAddress })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export async function editParty(partyAddress, _fields, _ids) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let userAddress = (await web3.eth.getAccounts())[0];

        let partyContract = new web3.eth.Contract(Party.abi, partyAddress);
        partyContract.methods
            .set(_fields, _ids)
            .send({ from: userAddress, gas: "3000000" })
            .then((result) => {
                resolve(result);
            });
    });
}

export async function joinParty(_id) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();

        let userAddress = (await web3.eth.getAccounts())[0];

        let utilsContract = new web3.eth.Contract(
            Utils.abi,
            utilsContractAddress
        );

        utilsContract.methods
            .changeParty(_id)
            .send({ from: userAddress, gas: "3000000" })
            .then((result) => {
                resolve(result);
            });
    });
}

export function getPartyVotes(addreses, _ballotAddress) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let userAddress = (await web3.eth.getAccounts())[0];
        let ballotContract = new web3.eth.Contract(Ballot.abi, _ballotAddress);
        ballotContract.methods
            .getPartyVotes(addreses)
            .call({ from: userAddress })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function getPartyIn() {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let userAddress = (await web3.eth.getAccounts())[0];
        let utilsContract = new web3.eth.Contract(
            Utils.abi,
            utilsContractAddress
        );
        utilsContract.methods
            .getPartyIn()
            .call({ from: userAddress })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
