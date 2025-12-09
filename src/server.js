const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const abi = require("../blockchain/abi.json");
const { contractAddress, rpcUrl } = require("../blockchain/config");
const CryptoJS = require("crypto-js");

// In-memory store for manufacturer data
const manufacturerStore = {};

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to Ganache
const provider = new ethers.JsonRpcProvider(rpcUrl);

// WARNING: do not push real key to GitHub
const signer = new ethers.Wallet(
  "0x325d56647f038d54abc2ea1bf6cca21b5504bd4a07b4019f0f595ea4d2413273",
  provider
);

const contract = new ethers.Contract(contractAddress, abi, signer);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Fake Product Identification API is running" });
});

// Simple /products route (optional)
app.post("/products", async (req, res) => {
  try {
    const { id, name, manufacturer } = req.body;

    const rawData = `${id}|${name}|${manufacturer}`;
    const qrHash = CryptoJS.SHA256(rawData).toString();

    const tx = await contract.registerProduct(
      Number(id),
      name,
      manufacturer,
      qrHash,
      { gasLimit: 3_000_000 }
    );

    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash,
      qrHash,
      rawData
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ success: false, error: err.reason || err.message });
  }
});

// Manufacturer route
app.post("/mfg/products", async (req, res) => {
  try {
    const { companyName, address, productID, productName, brand } = req.body;

    const timestamp = new Date().toISOString();

    manufacturerStore[productID] = {
      companyName,
      address,
      productID,
      productName,
      brand,
      mfgTimestamp: timestamp
    };

    const originText =
      `TrueTrace – Manufacturer Record\n` +
      `Company: ${companyName}\n` +
      `Address: ${address}\n` +
      `Product ID: ${productID}\n` +
      `Product Name: ${productName}\n` +
      `Brand: ${brand}\n` +
      `Recorded At: ${timestamp}`;

    const qrHash = CryptoJS.SHA256(originText).toString();

    const tx = await contract.registerProduct(
      0,
      productName,
      companyName,
      qrHash,
      { gasLimit: 3_000_000 }
    );
    await tx.wait();

    res.json({
      success: true,
      message:
        "Manufacturer data stored. Use retailer portal to generate final QR.",
      timestamp,
      txHash: tx.hash,
      qrHash
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ success: false, error: err.reason || err.message });
  }
});

// Retailer final‑QR route
app.post("/retailer/final-qr", async (req, res) => {
  try {
    const { productID, outletName, address, batchNo, brand } = req.body;

    const mfg = manufacturerStore[productID];
    if (!mfg) {
      return res.status(400).json({
        success: false,
        error:
          "No manufacturer data found for this Product ID. Please register at manufacturer portal first."
      });
    }

    const retailTimestamp = new Date().toISOString();

    const qrText =
      `TrueTrace – Complete Product & Batch Record ` +
      `Manufacturer: ${mfg.companyName} ` +
      `Mfg Address: ${mfg.address} ` +
      `Product ID: ${mfg.productID} ` +
      `Product Name: ${mfg.productName} ` +
      `Brand: ${mfg.brand} ` +
      `Manufactured At: ${mfg.mfgTimestamp} ` +
      `Retailer/Outlet: ${outletName} ` +
      `Retail Address: ${address} ` +
      `Batch No: ${batchNo} ` +
      `Retail Recorded At: ${retailTimestamp} ` +
      `Status: Genuine (recorded on TrueTrace blockchain)`;

    const qrHash = CryptoJS.SHA256(qrText).toString();

    const tx = await contract.registerProduct(
      0,
      mfg.productName,
      mfg.companyName,
      qrHash,
      { gasLimit: 3_000_000 }
    );

    await tx.wait
    res.json({
      success: true,
      txHash: tx.hash,
      qrHash,
      timestamp: retailTimestamp,
      qrText
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ success: false, error: err.reason || err.message });
  }
});

// Verify QR text against on‑chain hash
app.post("/verify", async (req, res) => {
  try {
    const { qrText } = req.body;
    if (!qrText) {
      return res
        .status(400)
        .json({ success: false, error: "qrText is required" });
    }

    const localHash = CryptoJS.SHA256(qrText).toString();

    const productId = 0;
    const product = await contract.products(productId);
    const onChainHash = product.qrHash;

    if (!onChainHash || onChainHash === "0x") {
      return res.status(400).json({
        success: false,
        error:
          "No on-chain record found for this product id. Register and generate QR first."
      });
    }

    const matches =
      localHash.toLowerCase() === onChainHash.toLowerCase();

    res.json({
      success: true,
      matches,
      localHash,
      onChainHash
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ success: false, error: err.reason || err.message });
  }
});

// Verify by numeric id (not used in QR flow)
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