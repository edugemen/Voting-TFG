import { getWeb3 } from "./metamask";
const Utils = require("../abis/Utils.json");

export const utilsContractAddress = Utils.address;

export async function isAccountRegistered(account) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();
        let utilsContract = new web3.eth.Contract(
            Utils.abi,
            utilsContractAddress
        );
        console.log(utilsContractAddress, account);
        utilsContract.methods
            .isRegistered(account)
            .call({ from: account })
            .then((result) => {
                console.log(result);
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export async function registerAccount(dni) {
    return new Promise(async (resolve, reject) => {
        let web3 = await getWeb3();

        let userAddress = (await web3.eth.getAccounts())[0];

        let data = {
            sender: userAddress,
            dni: parseInt(dni),
        };

        //sign typed data
        let typedData = JSON.stringify({
            types: {
                EIP712Domain: [
                    { name: "name", type: "string" },
                    { name: "version", type: "string" },
                    { name: "chainId", type: "uint256" },
                    { name: "verifyingContract", type: "address" },
                ],
                secureRegister: [
                    { name: "sender", type: "address" },
                    { name: "dni", type: "uint" },
                ],
            },
            primaryType: "secureRegister",
            domain: {
                name: "newUser",
                version: "1",
                chainId: await web3.eth.net.getId(),
                verifyingContract: utilsContractAddress,
            },
            message: data,
        });

        var method = "eth_signTypedData_v3";

        web3.currentProvider.sendAsync(
            {
                method: method,
                params: [userAddress, typedData],
                from: userAddress,
            },
            async function (err, result) {
                if (err) {
                    reject(err);
                }

                const rawResponse = await fetch(
                    "http://localhost:3005/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            signature: result.result,
                            typedData: typedData,
                            ...data,
                        }),
                    }
                );

                const response = await rawResponse.json();

                resolve(response.status);
            }
        );
    });
}
