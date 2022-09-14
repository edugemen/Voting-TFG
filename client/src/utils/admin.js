import { getWeb3 } from "./metamask";

import { utilsContractAddress } from "./auth";
import Ballot from "../abis/Ballot.json";

export function createBallot(question, options) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let userAddress = localStorage.getItem("userAccount");
        let ballotContract = new web3.eth.Contract(Ballot.abi);

        ballotContract
            .deploy({
                data: Ballot.bytecode,
                arguments: [question, options, utilsContractAddress],
            })
            .send({ from: userAddress, gas: "4000000" })
            .then((receipt) => {
                console.log(receipt.options.address);
                resolve(receipt.options.address);
                // let storageContract = new web3.eth.Contract(
                //     Storage.abi,
                //     STORAGE_CONTRACT_ADDRESS
                // );

                // console.log(receipt.options.address);
                // console.log(userAddress);

                // storageContract.methods
                //     .addBallot(receipt.options.address)
                //     .send({
                //         from: userAddress,
                //         gas: "4000000",
                //     })
                //     .then(() => {
                //         resolve(receipt.options.address);
                //     })
                //     .catch((error) => {
                //         reject(error);
                //     });
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function getBallotList() {
    return new Promise(async (resolve, reject) => {
        // let web3 = await getWeb3();
        // let userAddress = (await web3.eth.getAccounts())[0];
        // let storageContract = new web3.eth.Contract(
        //     Storage.abi,
        //     STORAGE_CONTRACT_ADDRESS
        // );

        // storageContract.methods
        //     .getBallots(userAddress)
        //     .call({ from: userAddress })
        //     .then(async (result) => {
        //         let res = [];

        //         for (let i = 0; i < result.length; i++) {
        //             let ballotContract = new web3.eth.Contract(
        //                 Ballot.abi,
        //                 result[i]
        //             );

        //             await ballotContract.methods
        //                 .getData()
        //                 .call({ from: userAddress })
        //                 .then((data) => {
        //                     let ballot = {
        //                         ...data,
        //                         address: result[i],
        //                     };
        //                     res.push(ballot);
        //                 });
        //         }

        //         resolve(res);
        //     })
        //     .catch((error) => {
        //         reject(error);
        //     });
        resolve([]);
    });
}
