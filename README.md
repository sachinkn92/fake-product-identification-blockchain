<img width="827" height="633" alt="login page" src="https://github.com/user-attachments/assets/ea0d6b5b-2f3c-4a23-baad-7cb9c4a5ac37" />
TrueTrace – Fake Product Identification Using Blockchain
TrueTrace is a blockchain‑based system that links each product to a tamper‑proof digital record using QR codes and smart contracts. It helps manufacturers, retailers, and customers verify product authenticity and trace the product’s journey through the supply chain.​

Features
Manufacturer portal to register product origin and details.​

Retailer/Seller portal to record outlet, batch, and brand information.

Single QR code that contains:

Manufacturer details

Retailer/outlet details

Batch and timestamps

“Status: Genuine (recorded on TrueTrace blockchain)”

SHA‑256 hash of the QR text stored on an Ethereum‑compatible blockchain (Ganache) via a smart contract.​

Verify page:

Paste QR text (e.g., from Google Lens).

System recomputes hash and compares with on‑chain hash.

Shows “Genuine” if hashes match, “Tampered / invalid” otherwise.​

Tech Stack
Frontend: React (TrueTrace UI)

Backend: Node.js, Express, ethers.js

Blockchain: Hardhat, Solidity, Ganache (local Ethereum node)

QR generation: qrcode.react (QRCanvas)

Hashing: crypto-js (SHA‑256)

System Modules
Manufacturer Module

Inputs: company name, address, product ID, product name, brand.

Generates manufacturer record and stores it in memory plus a hash on-chain.​

Retailer/Seller Module

Inputs: product ID, outlet name, address, batch number, brand.

Looks up manufacturer data, builds a combined QR text, hashes it, and writes hash to contract.

Customer / Verification Module

Customer scans QR (Google Lens) and sees all details.

Verification page recomputes hash from pasted text and checks against smart contract for authenticity.​

How to Run (Development Setup)
Start Ganache

Open Ganache GUI.

Quickstart workspace with RPC: HTTP://127.0.0.1:7545, Chain ID: 1337.​

Deploy Smart Contract

bash
cd fake-product-blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network ganache
Copy the deployed contract address into blockchain/config.js:

js
module.exports = {
  contractAddress: "0x...DEPLOYED_ADDRESS...",
  rpcUrl: "http://127.0.0.1:7545"
};
Configure Backend

In src/server.js, set rpcUrl from blockchain/config.js and use a Ganache private key for the signer (for college demo only; do not push real keys to public repos).

Run Backend

bash
cd fake-product-blockchain
npm install
npm run dev
Backend runs at http://localhost:5000.

Run TrueTrace UI

bash
cd truetrace-ui
npm install
npm start
UI runs at http://localhost:3000.

Usage Flow for Demo
Login

Open http://localhost:3000.

Use demo credentials (example):

Manufacturer: mfg001 / mfg123

Retailer: ret001 / ret123.
<img width="827" height="633" alt="login page" src="https://github.com/user-attachments/assets/47058282-188d-40c9-9a0c-cc87a06441d9" />

Manufacturer Portal
<img width="812" height="904" alt="manufacturer console" src="https://github.com/user-attachments/assets/3aff3c50-17df-42ae-aec0-c3966a01b25e" />

Enter: company name, address, product ID, product name, brand.

Submit → manufacturer data stored and origin hash written on-chain.​
<img width="812" height="1053" alt="manufacturer details" src="https://github.com/user-attachments/assets/80903f80-a7ce-4683-a230-1afdd927b347" />

Retailer/Seller Portal
<img width="812" height="924" alt="retailer console" src="https://github.com/user-attachments/assets/ef2a5276-22ab-4920-8299-39e6bb45f604" />

Enter: product ID (same as manufacturer), outlet name, address, batch number, brand.

Submit → system builds a single‑line QR text with all fields, hashes it, and stores the hash in the contract.
<img width="812" height="1354" alt="retailer details" src="https://github.com/user-attachments/assets/1bc1ba7e-36c4-4642-ab93-e51efe694689" />

UI displays the final QR and shows encoded text.

Customer Verification

Scan the QR with Google Lens and view the full text.
<img width="566" height="455" alt="image" src="https://github.com/user-attachments/assets/72a3562d-67c6-4653-90e8-bc359a200556" />

Open Verify page (/verify), paste that text, and click “Verify against blockchain”.
<img width="827" height="633" alt="verify console" src="https://github.com/user-attachments/assets/f92da0e1-d7dd-48eb-8c72-933af5e010f7" />

If text is unchanged → “Genuine” (hashes match).
<img width="812" height="690" alt="verify passed" src="https://github.com/user-attachments/assets/140e9078-4673-41ca-a084-49d05f3422db" />

If any character is changed → “Tampered / invalid” (hashes differ).
<img width="812" height="690" alt="verify failed" src="https://github.com/user-attachments/assets/5ae5204e-8a89-49ec-8666-2a450685135a" />


Project Team
RAGHAVENDRA A N [4YG22CS083]

SACHIN K N [4YG22CS087]

SACHIN K S [4YG22CS088]

SAGAR K [4YG22CS089]
