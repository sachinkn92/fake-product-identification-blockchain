const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const abi = require("../blockchain/abi.json");
const { contractAddress, rpcUrl } = require("../blockchain/config");
const CryptoJS = require("crypto-js");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// connect to Ganache
const provider = new ethers.JsonRpcProvider(rpcUrl);

// use the same private key you put in hardhat.config.js
const signer = new ethers.Wallet("0x6f78d3638a7d4c94963f9060f5e3166feac082d42ee2dbd166a884f952287b36", provider);

const contract = new ethers.Contract(contractAddress, abi, signer);

// simple health check
app.get("/", (req, res) => {
  res.json({ message: "Fake Product Identification API is running" });
});

// register product
app.post("/products", async (req, res) => {
  try {
    const { id, name, manufacturer } = req.body;

    // 1) Build a simple string from product data
    const rawData = `${id}|${name}|${manufacturer}`;

    // 2) Create SHA-256 hash for QR
    const qrHash = CryptoJS.SHA256(rawData).toString();

    // 3) Call smart contract with generated hash
    const tx = await contract.registerProduct(
      id,
      name,
      manufacturer,
      qrHash
    );

    await tx.wait();

    // 4) Return info to client (will be used to build QR code later)
    res.json({
      success: true,
      txHash: tx.hash,
      qrHash,
      rawData
    });
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
