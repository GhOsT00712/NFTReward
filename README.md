# Rewards DApp

## Ethernium D-App for Teams Rewards app

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

## Pre Requisite
Rewards Dapp requires [Node.js](https://nodejs.org/) v17+ to run.

## Dev Steps

#### Build Contract
```sh
npx hardhat compile
```
### Deploy contract
```sh
npx hardhat --network <networkName> run scripts/deploy.js
```

### MintNFT
```sh
node scripts/mint-nft.js
```

## License

MIT

**Free Software, Hell Yeah!**