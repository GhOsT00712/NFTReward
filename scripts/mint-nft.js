require("dotenv").config()
const fetch = require("node-fetch")
const { Alchemy, Network } = require("alchemy-sdk")

// env variables 
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const config = {
    apiKey: "ntTumht4jK8DDCy7ry10K_nggxN3GpQZ",
    network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(config);

//alchemy web3 instance
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

//contract ABI
const contract = require("../artifacts/contracts/nft.sol/NFT.json")
// console.log(JSON.stringify(contract.abi))

const contractAddress = "0xb7529610fc2d5661a1d07e030e83e41b24dbc583" //public address of contract
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

// create transaction
async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); // get transaction count

    var tx = {
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
        tx = await web3.eth.getTransactionReceipt(hash.transactionHash)

        let logs = tx.logs;
        // console.log(logs);
        const tokenId = web3.utils.hexToNumber(logs[0].topics[3])
        console.log(await getNFTMetadata(tokenId))
        return tokenId;

    } catch (err) {
        console.log(err);
    }
}

// search NFT metadata
async function getNFTMetadata(tokenId) {
    const nft = await nftContract.methods.tokenURI(tokenId).call()
    console.log(nft)
    const response = await fetch(nft);

    if (!response.ok)
        throw new Error(response.statusText);

    const json = await response.json();
    return json;
}

//sleep function
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function getAllTransactionOnAddress(userPublicKey) {
    // Get all NFTs under a particular user
    const nfts = await alchemy.nft.getNftsForOwner(userPublicKey);
    return nfts;
}

module.exports = { mintNFT, getAllTransactionOnAddress };



