const nft = require("./scripts/mint-nft.js");
const express = require('express')
require("dotenv").config()

const app = express()
const port = process.env.PORT
const metaDataHost = process.env.METADATAHOST

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/get/:userAddress', async (req, res) => {
    const { userAddress } =req.params;
    res.send(await nft.getAllTransactionOnAddress(userAddress));
})

app.post('/mint', async (req, res) => {
    const help = await nft.mintNFT(metaDataHost);
    res.send('Token Id of the NFT is ' + help)
})

app.listen(port, () => {
    console.log(`Example app listening on url http://localhost:${port}`)
})