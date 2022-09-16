require("dotenv").config()
const fetch = require("node-fetch")
const { Alchemy, Network } = require("alchemy-sdk")

// env variables 
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const config = {
    apiKey: "N5s7eE3IXH1Udfxs2P2RtRa0G_1SSt-V",
    network: Network.ETH_RINKEBY,
};
const alchemy = new Alchemy(config);

//alchemy web3 instance
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

//contract ABI
const contract = require("../artifacts/contracts/nft.sol/NFT.json")
// console.log(JSON.stringify(contract.abi))

const contractAddress = "0x10c8CC0369FA0D4a00BC89354212B5d2e074e742" //public address of contract
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
        await sleep(8000)

        //getting latest transaction data
        const tx = await web3.eth.getTransactionReceipt(hash.transactionHash)

        let logs = tx.logs;
        // console.log(logs);
        const topicId = web3.utils.hexToNumber(logs[0].topics[3])
        console.log("topicId ", topicId);
        getNFTMetadata(topicId);


    } catch (err) {
        console.log(err);
    }
}

//mint NFT with nft-metadata.json uploaded in ipsf (pinata)
console.log(" All looks good ! Minting NFT now.")
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


async function getAllTransactionOnAddress() {
    // Get all NFTs
    const nfts = await alchemy.nft.getNftsForOwner(PUBLIC_KEY);
    // Print NFTs
    console.log(nfts);
}
getAllTransactionOnAddress()

// async function transferNFT() {
//     try {
//         console.log(await nftContract.methods.ownerOf(16).call())
//         // await nftContract.methods.approve(PUBLIC_KEY, 16).call()
//         // await nftContract.methods.safeTransferFrom(PUBLIC_KEY, "0xE40a221AaEa01aBa3271ebBC4A0d9101Fb668898", 16).call()
//     }
//     catch (ex) {
//         console.log(ex.message)
//     }
//     // await nftContract.methods.safeTransferFrom(PUBLIC_KEY, "0xE40a221AaEa01aBa3271ebBC4A0d9101Fb668898", 15).call()
// }

// console.log("Transffering NFT to new owner")

