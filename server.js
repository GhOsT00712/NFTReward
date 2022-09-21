const nft = require("./scripts/mint-nft.js");
const express = require('express')
require("dotenv").config()

const app = express()
const port = process.env.PORT
const metaDataHost = 

app.get('/', async (req, res) => {
    res.send('Hello World!')
})

app.get('/get/:userAddress', async (req, res) => {
    console.log("calling get nft info")
    const { userAddress } = req.params;
    try {
        const nftData = await nft.getAllTransactionOnAddress(userAddress);
        return res.send(nftData);
    }
    catch(err) {
        res.status(400).send(err.message);
    }
})

app.post('/mint/:metaDataName', async (req, res) => {
    const { metaDataName } = req.params;
    let metaDataHost;
    try {
        switch(metaDataName) {
            case "innovator":
              metaDataHost= process.env.METADATA_INNOVATOR
              break;
            case "top":
                metaDataHost= process.env.METADATA_TOP
              break;
            case "help":
                metaDataHost= process.env.METADATA_HELP
              break;
            default:
                metaDataHost= process.env.METADATA_INNOVATOR
          }
        const tokenId = await nft.mintNFT(metaDataHost);
        return res.send(tokenId.toString());
    }
    catch(err) {
        res.status(400).send(err.message);
    }
})

app.post('/transfer/:tokenId/:toAddress', async (req, res) => {
    const { tokenId, toAddress } = req.params;
    console.log("tokenId ", tokenId);
    console.log("toAddress ", toAddress);
    try {
        transaction = await nft.transferNFT(tokenId, toAddress);
        return res.send("Transferred NFT");
    }
    catch(err) {
        res.status(400).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on url http://localhost:${port}`)
})