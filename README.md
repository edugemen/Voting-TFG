# Decentralized voting app

## Install

You will need NodeJs to run everything. You can download the latest version [here](https://nodejs.org/en/).

Then you can install yarn and truffle with this commands:

```ps
npm i -g yarn
```

```ps
npm i -g truffle
```

## Quick Usage

First of all, fill all the fields in _.env.default_ and rename it to _.env_.

Then, run this command in the base directory:

```ps
truffle compile --reset
```

Then, cd into the server directory and run:

```ps
yarn
yarn start
```

And then, copy all the json files in build/contracts except Migrations.json into client/src/abis. Then cd into the client directory and run:

```ps
npm install
npm start
```
