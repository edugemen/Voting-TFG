//Get contract json from parent project
const fs = require("fs");
const path = require("path");

function getContract(name) {
    let projectPath = path.join(__dirname, "..");
    let contractPath = path.join(
        projectPath,
        "..",
        "build",
        "contracts",
        name + ".json"
    );
    let contract = JSON.parse(fs.readFileSync(contractPath));
    return contract;
}

module.exports = { getContract };
