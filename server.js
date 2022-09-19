const express = require('express')
const nft = require('./scripts/mint-nft')
require("dotenv").config()
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/transfer/:tokenId/:toAddress', async (req, res) => {
    const { tokenId, toAddress } = req.params;
    console.log("tokenId ", tokenId);
    console.log("toAddress ", toAddress);
    await nft.transferNFT(tokenId, toAddress);
    return res.send("Transfered NFT");
})

app.listen(port, () => {
    console.log(`Example app listening on url http://localhost:${port}`)
})