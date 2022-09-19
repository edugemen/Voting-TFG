const { ethers } = require("ethers");
//require dotenv
require("dotenv").config({ path: "../.env" });

const SUBNET_URL = process.env.RPC_URL;

let Web3 = require("web3");
const web3 = new Web3(SUBNET_URL);

const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);

const account = web3.eth.accounts.privateKeyToAccount(
    wallet._signingKey().privateKey
);

async function sendTransaction(transaction) {
    const options = {
        to: transaction._parent._address,
        data: transaction.encodeABI(),
        gas: await transaction.estimateGas({ from: account.address }),
        gasPrice: await web3.eth.getGasPrice(),
        from: account.address,
    };

    const signed = await web3.eth.accounts.signTransaction(
        options,
        account.privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

    return receipt;
}

function getRsv(sig) {
    const signature = sig.substring(2);
    const r = "0x" + signature.substring(0, 64);
    const s = "0x" + signature.substring(64, 128);
    const v = parseInt(signature.substring(128, 130), 16);
    return { r, s, v };
}

module.exports = { web3, sendTransaction, getRsv };
