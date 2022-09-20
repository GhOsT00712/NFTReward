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