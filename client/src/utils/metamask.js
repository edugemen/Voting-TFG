import { useNavigate } from "react-router-dom";
import Web3 from "web3/dist/web3.min.js";
import { isAccountRegistered } from "./auth";

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

// function initAccount() {
//     let navigate = useNavigate();

//     getWeb3().then(async (web3) => {
//         let userAccount = localStorage.getItem("userAccount");
//         let registered = await isAccountRegistered(userAccount);
//         if (!registered) {
//             navigate("/register");
//         }
//         // isAdmin().then((isAdmin) => {
//         //     console.log(isAdmin);
//         //     setAdmin(isAdmin);
//         // });
//     });
// }
