const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const abi = require("../blockchain/abi.json");
const { contractAddress, rpcUrl } = require("../blockchain/config");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// connect to Ganache
const provider = new ethers.JsonRpcProvider(rpcUrl);

// use the same private key you put in hardhat.config.js
const signer = new ethers.Wallet("0xf17e8c8423dfcbfc9ac74e2bbe27a2dfba8276b51ba005d51760738284db4c11", provider);

const contract = new ethers.Contract(contractAddress, abi, signer);

// simple health check
app.get("/", (req, res) => {
  res.json({ message: "Fake Product Identification API is running" });
});

// register product
app.post("/products", async (req, res) => {
  try {
    const { id, name, manufacturer, qrHash } = req.body;

    const tx = await contract.registerProduct(
      id,
      name,
      manufacturer,
      qrHash
    );

    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.reason || err.message });
  }
});

// verify by id
app.get("/products/:id/verify", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const exists = await contract.verifyProductById(id);
    res.json({ id, exists });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
