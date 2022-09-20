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

let ballotList = [];

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

app.get("/ballots/:size", async (req, res) => {
    let size = req.params.size;

    res.send(ballotList.slice(-size));
});

function listenToEvents() {
    //Use a timer and each time it fires, check all the ballots
    setInterval(async () => {
        let utilsContract = new web3.eth.Contract(Utils.abi, UTILS_ADDRESS);

        let ballots = await utilsContract.methods.getBallots().call();

        for (let i = ballotList.length; i < ballots.length; i++) {
            let ballotContract = new web3.eth.Contract(
                getContract("Ballot").abi,
                ballots[i]
            );
            let data = await ballotContract.methods.getData().call();

            ballotList.push({
                address: ballots[i],
                question: data[0],
                options: data[1],
                timestamp: Date.now(),
            });
        }
    }, 60000);
}

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
    if (!UTILS_ADDRESS) {
        console.log("Utils contract not found");
        let addresses = await deployContracts();
        UTILS_ADDRESS = addresses[0];
        console.log(addresses);
    }
    listenToEvents();
});
