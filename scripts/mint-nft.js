require("dotenv").config()
const fetch = require("node-fetch")
// env variables 
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

//alchemy web3 instance
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

//contract ABI
const contract = require("../artifacts/contracts/nft.sol/NFT.json")
// console.log(JSON.stringify(contract.abi))

const contractAddress = "0xF994F1Aa906b347F458034e5aBBFaC1d0f28b2CA" //public address of contract
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
            "The hash of your transaction is: ",
            hash.transactionHash,
            "\nCheck Alchemy's Mempool to view the status of your transaction!"
        )
        await sleep(8000)
        getNFTMetadata(nonce);
    } catch (err) {
        console.log(err);
    }
}

//mint NFT with nft-metadata.json uploaded in ipsf (pinata)
console.log(" All looks good ! Minting NFT now.")
mintNFT("https://gateway.pinata.cloud/ipfs/QmcSvsZ9Suz1PDKt1xgJM82mFq1gx284Z1uCRgTH4cc8jt")

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

