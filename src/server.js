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
const signer = new ethers.Wallet("0x89eb7604fea51064c7a13da5dde5b09c537a60667c7c3678359e8d08592c5c0a", provider);

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

app.post("/mfg/products", async (req, res) => {
  try {
    const { companyName, address, productID, productName, brand } = req.body;

    const timestamp = new Date().toISOString();

    // Human‑readable text that will go inside the QR
    const qrText =
      `TrueTrace – Manufacturer Record\n` +
      `Company: ${companyName}\n` +
      `Address: ${address}\n` +
      `Product ID: ${productID}\n` +
      `Product Name: ${productName}\n` +
      `Brand: ${brand}\n` +
      `Recorded At: ${timestamp}\n` +
      `Status: Genuine (recorded on TrueTrace blockchain)`;

    // Hash for blockchain storage
    const qrHash = CryptoJS.SHA256(qrText).toString();

    // For now reuse existing contract function with productID as numeric id.
    // If productID is not numeric, map it yourself. Here we'll just use 0 and rely on hash.
    const tx = await contract.registerProduct(
      0, // or Number(productID) if numeric
      productName,
      companyName,
      qrHash
    );

    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash,
      qrHash,
      timestamp,
      qrText
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ success: false, error: err.reason || err.message });
  }
});

app.post("/retailer/batch", async (req, res) => {
  try {
    const { companyName, address, batchNo, brand } = req.body;

    const timestamp = new Date().toISOString();

    const qrText =
      `TrueTrace – Retailer/Seller Record\n` +
      `Outlet: ${companyName}\n` +
      `Address: ${address}\n` +
      `Batch No: ${batchNo}\n` +
      `Brand: ${brand}\n` +
      `Recorded At: ${timestamp}\n` +
      `Status: Genuine batch (recorded on TrueTrace blockchain)`;

    const qrHash = CryptoJS.SHA256(qrText).toString();

    // Reuse same contract; here we use 0 and store metadata in hash
    const tx = await contract.registerProduct(
      0, // or some batch-based numeric id if you design it
      batchNo,
      companyName,
      qrHash
    );

    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash,
      qrHash,
      timestamp,
      qrText
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ success: false, error: err.reason || err.message });
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
