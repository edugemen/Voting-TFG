const express = require("express");
var cors = require("cors");
require("dotenv").config({ path: "../.env" });
const { web3, sendTransaction, getRsv } = require("./utils/eth");
const { getContract, deployContracts } = require("./utils/contract");
const fs = require("fs");
const path = require("path");

const Utils = getContract("Utils");

let UTILS_ADDRESS = undefined;

if (Utils.address) {
    UTILS_ADDRESS = Utils.address;
}

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

//Register
app.post("/register", async (req, res) => {
    try {
        let { r, s, v } = getRsv(req.body.signature);

        let utilsContract = new web3.eth.Contract(Utils.abi, UTILS_ADDRESS);

        let register = utilsContract.methods.secureRegister(
            v,
            r,
            s,
            req.body.sender,
            req.body.dni
        );

        let receipt = await sendTransaction(register);

        res.send(receipt);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    if (!UTILS_ADDRESS) {
        console.log("Utils contract not found");
        deployContracts();
    }
});
