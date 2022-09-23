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
                resolve(receipt.options.address);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
