import { getWeb3 } from "./metamask";
import Ballot from "../abis/Ballot.json";
import Party from "../abis/Party.json";

export function getBallotData(ballotAddress) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let ballotContract = new web3.eth.Contract(Ballot.abi, ballotAddress);
        ballotContract.methods
            .getData()
            .call()
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function securePartyVote(ballotAddress, partyAddress, option) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let sender = (await web3.eth.getAccounts())[0];

        console.log(ballotAddress, partyAddress, option);

        let partyContract = new web3.eth.Contract(Party.abi, partyAddress);

        partyContract.methods
            .partyVote(ballotAddress, option)
            .send({ from: sender, gas: "3000000" })
            .then((result) => {
                resolve(result);
            });
    });
}

export function secureVote(ballotAddress, option) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();

        let sender = (await web3.eth.getAccounts())[0];

        let ballotContract = new web3.eth.Contract(Ballot.abi, ballotAddress);

        ballotContract.methods
            .vote(option)
            .send({ from: sender })
            .then((result) => {
                resolve(result);
            });
    });
}

export function getFinalVotes(ballotAddress) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let sender = (await web3.eth.getAccounts())[0];
        let ballotContract = new web3.eth.Contract(Ballot.abi, ballotAddress);
        ballotContract.methods
            .getVotes()
            .call({ from: sender })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
