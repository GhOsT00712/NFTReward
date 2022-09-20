# Rewards DApp

## Ethernium D-App for Teams Rewards app

[![Build](https://github.com/GhOsT00712/NFTReward/actions/workflows/azure-container-webapp.yml/badge.svg)](https://github.com/GhOsT00712/NFTReward/actions/workflows/azure-container-webapp.yml)

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