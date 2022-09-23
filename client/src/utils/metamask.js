import Web3 from "web3/dist/web3.min.js";

export function getWeb3() {
    return new Promise(async (resolve, reject) => {
        if (window.ethereum) {
            try {
                let accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                localStorage.setItem("userAccount", accounts[0]);

                // Accounts now exposed
                let web3 = new Web3(window.ethereum);
                resolve(web3);
            } catch (error) {
                reject(error);
            }
        }
    });
}
