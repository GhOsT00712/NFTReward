require("dotenv").config()

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

const contractAddress = "0x5abd8ca2509a6d463581f8e5af468df0015a3d74" //public address of contract
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
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)

    //make sure that it is mined properly.
    signPromise.then((signedTX) => {
        web3.eth.sendSignedTransaction(signedTX.rawTransaction, function (err, hash) {
            if (!err) {
                console.log(
                    "The hash of your transaction is: ",
                    hash,
                    "\nCheck Alchemy's Mempool to view the status of your transaction!"
                )
            }
            else {
                console.log(
                    "Something went wrong when submitting your transaction:",
                    err
                )
            }
        })
    }).catch((err) => {
        console.log("Promise Failed :", err)
    })
}

//mint NFT with nft-metadata.json uploaded in ipsf (pinata)
console.log(" All looks good ! Minting NFT now.")
mintNFT("ipfs://QmcSvsZ9Suz1PDKt1xgJM82mFq1gx284Z1uCRgTH4cc8jt")