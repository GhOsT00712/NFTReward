require("dotenv").config()
const fetch = require("node-fetch")
const { Alchemy, Network } = require("alchemy-sdk")

// env variables 
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const config = {
    apiKey: "GIsNWI5BbuALsudQ9IYNnHmM-6bW5iBp",
    network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(config);

//alchemy web3 instance
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

//contract ABI
const contract = require("../artifacts/contracts/nft.sol/NFT.json")
// console.log(JSON.stringify(contract.abi))

const contractAddress = "0x51Aa16912d2F7eC8Af4baD1a569Ac6D8187b20f8" //public address of contract
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

// create transaction
async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); // get transaction count

    const tx = {
        from: PUBLIC_KEY,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI() // what to do -> i.e mintNFT
    };

    // sign transaction with web3 
    //make sure that it is mined properly.
    let signedTX;
    let hash;
    
    try {
        signedTX = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
        hash = await web3.eth.sendSignedTransaction(signedTX.rawTransaction)
        console.log(
            "The hash of your transaction is: ", hash.transactionHash)

        //getting latest transaction data
        const txLatest = await web3.eth.getTransactionReceipt(hash.transactionHash)

        let logs = txLatest.logs;
        // console.log(logs);
        const topicId = web3.utils.hexToNumber(logs[0].topics[3])
        console.log("topicId ", topicId);
        getNFTMetadata(topicId);

    } catch (err) {
        console.log(err);
    }
}

//mint NFT with nft-metadata.json uploaded in ipsf (pinata)
// console.log(" All looks good ! Minting NFT now.")
// mintNFT("https://gateway.pinata.cloud/ipfs/QmcSvsZ9Suz1PDKt1xgJM82mFq1gx284Z1uCRgTH4cc8jt")

// search NFT metadata
async function getNFTMetadata(tokenId) {
    const nft = await nftContract.methods.tokenURI(tokenId).call()
    console.log(nft)
    const response = await fetch(nft);

    if (!response.ok)
        throw new Error(response.statusText);

    const json = await response.json();
    console.log(json)
}

//sleep function
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


async function getAllTransactionOnAddress(address) {
    // Get all NFTs
    console.log("Getting all NFTs minted by address: ", address);
    const nfts = await alchemy.nft.getNftsForOwner(address);
    // Print NFTs
    console.log(nfts);
}

async function transferNFT(tokenId, toAddress) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); // get transaction count
    const tx = {
        from: PUBLIC_KEY,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.safeTransferFrom(PUBLIC_KEY, toAddress, tokenId).encodeABI() // what to do -> i.e mintNFT
    };

    // sign transaction with web3 
    //make sure that it is mined properly.
    let signedTX;
    let hash;
    
    try {
        signedTX = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
        hash = await web3.eth.sendSignedTransaction(signedTX.rawTransaction)
        console.log(
            "The hash of your transaction is: ", hash.transactionHash)

        //getting latest transaction data
        const txLatest = await web3.eth.getTransactionReceipt(hash.transactionHash)

        let logs = txLatest.logs;
        console.log(logs);

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    mintNFT,
    getNFTMetadata,
    getAllTransactionOnAddress,
    transferNFT
}