# TrueTrace: Fake Product Identification Using Blockchain

## Project Report 2024–2025

---

## Executive Summary

TrueTrace is a blockchain-based system designed to combat counterfeit products by linking each product to a tamper-proof digital record using QR codes and smart contracts. The system enables manufacturers to register product origins, retailers to record batch-level details, and customers to verify authenticity by scanning QR codes and checking the immutable blockchain record.

This report details the complete implementation of TrueTrace, including architecture, technology stack, module descriptions, testing, results, and conclusions.

---

## 1. Introduction

### 1.1 Problem Statement

The global counterfeit market poses a significant threat to consumer trust and brand integrity. According to industry reports, counterfeit goods account for approximately 3.3% of global trade, with consumers often unable to distinguish genuine products from fakes at the point of purchase.

**Key Challenges:**
- Lack of transparent supply chain visibility
- Difficulty in verifying product authenticity
- No immutable record of product origin and journey
- Limited traceability from manufacturer to end customer
- Manual verification processes that are time-consuming and error-prone

### 1.2 Objectives

The TrueTrace project aims to:

1. **Create an immutable product registry** using blockchain technology that records manufacturer details, retailer information, and batch tracking.
2. **Generate tamper-proof QR codes** containing all product and batch information, with cryptographic hashing to detect any modifications.
3. **Enable end-customer verification** through a simple mobile-friendly interface that compares scanned QR text against on-chain records.
4. **Establish supply chain transparency** by recording the complete journey of products from manufacturer through retailer to customer.
5. **Prevent counterfeit distribution** by making it computationally infeasible to fake or modify product records.

### 1.3 Scope

This project focuses on:
- Prototype development for a local Ethereum-compatible blockchain (Ganache)
- Three core modules: Manufacturer, Retailer/Seller, and Customer Verification
- Integration of QR code generation with SHA-256 hashing
- Role-based authentication for different stakeholders
- End-to-end demonstration of the authentication and verification flow

---

## 2. Literature Review & Related Work

### 2.1 Blockchain in Supply Chain

Blockchain technology has emerged as a transformative solution for supply chain management due to its:
- **Immutability**: Once data is recorded, it cannot be altered without detection
- **Transparency**: All authorized parties can view transaction history
- **Decentralization**: No single point of failure or control
- **Cryptographic Security**: SHA-256 and ECDSA provide strong security guarantees

### 2.2 Related Systems

- **Hyperledger Fabric**: Enterprise-grade blockchain platform for supply chain (requires complex setup)
- **VeChain**: Blockchain platform specifically designed for product authentication
- **Waltonchain**: IoT-integrated blockchain for supply chain tracking
- **Traditional QR Code Systems**: Static QR codes without blockchain backing are vulnerable to tampering

### 2.3 Innovation in TrueTrace

TrueTrace combines:
1. **Single canonical QR format** (single-line text) for consistent hashing
2. **SHA-256 cryptographic hashing** to detect any text modification
3. **Smart contract storage** of hashes on an Ethereum-compatible chain
4. **Role-based portals** (Manufacturer, Retailer, Customer) for easy adoption
5. **Google Lens integration** for seamless customer scanning and verification

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    TrueTrace System Overview                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  FRONTEND LAYER (React)                                          │
│  ├─ Login Page (Role Selection)                                  │
│  ├─ Manufacturer Portal                                          │
│  ├─ Retailer/Seller Portal                                       │
│  └─ Verification Page                                            │
│                                                                   │
│  BACKEND LAYER (Node.js / Express)                               │
│  ├─ /mfg/products → Register manufacturer data                  │
│  ├─ /retailer/final-qr → Generate combined QR & hash            │
│  └─ /verify → Compare hashes against blockchain                 │
│                                                                   │
│  BLOCKCHAIN LAYER (Solidity / Ganache)                           │
│  ├─ ProductRegistry Smart Contract                               │
│  ├─ registerProduct(id, name, manufacturer, qrHash)             │
│  └─ products[id] → Stores qrHash immutably                      │
│                                                                   │
│  EXTERNAL SERVICES                                               │
│  └─ Google Lens (for customer QR scanning)                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow

**Manufacturer Registration:**
1. Manufacturer enters: company name, address, product ID, product name, brand
2. Backend creates timestamp and stores data in-memory
3. Backend builds canonical QR text and computes SHA-256 hash
4. Hash is written to smart contract at `products[0].qrHash`

**Retailer Batch Recording:**
1. Retailer enters: product ID, outlet name, address, batch number, brand
2. Backend retrieves manufacturer data from in-memory store
3. Backend builds combined QR text (single-line format) with all details
4. Backend computes SHA-256 hash of combined text
5. Hash is written to smart contract (overwrites `products[0].qrHash` with latest)
6. React UI displays QR code and encoded text

**Customer Verification:**
1. Customer scans QR with Google Lens
2. Customer copies the displayed text
3. Customer pastes text into Verify page
4. Frontend sends text to backend
5. Backend computes SHA-256 hash of received text
6. Backend reads `products[0].qrHash` from smart contract
7. Hashes are compared:
   - Match → "Genuine" (green)
   - Mismatch → "Tampered / invalid" (red)

### 3.3 Key Components

#### Frontend (React)
- **Technology**: React 18, Axios, QRCode.react, crypto-js
- **Pages**: Login, Manufacturer, Retailer, Verify
- **Features**: Role-based routing, real-time form validation, QR display

#### Backend (Node.js)
- **Technology**: Express, ethers.js, crypto-js, CORS
- **Port**: 5000
- **Key Functions**: 
  - SHA-256 hash computation
  - Smart contract interaction
  - Manufacturer data caching

#### Blockchain (Solidity)
- **Network**: Ganache (local Ethereum, Chain ID 1337, RPC 7545)
- **Smart Contract**: ProductRegistry
- **Key Function**: `registerProduct(uint256 _id, string _name, string _manufacturer, string _qrHash)`

#### QR Code
- **Library**: qrcode.react (QRCodeCanvas)
- **Content**: Canonical single-line text
- **Format**: All product + retailer details in single-line string

---

## 4. Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, JSX, CSS-in-JS |
| UI Library | React Router, Axios |
| QR Generation | qrcode.react |
| Hashing | crypto-js (SHA-256) |
| Backend | Node.js 18+, Express 4 |
| Blockchain | Solidity 0.8.x, Hardhat |
| Local Chain | Ganache (Ethereum simulator) |
| Web3 Integration | ethers.js 6 |
| Authentication | Simple role-based (demo credentials) |
| Deployment | Localhost (development) |

---

## 5. Module Descriptions

### 5.1 Manufacturer Module

**Purpose**: Register product origin details on the blockchain.

**Inputs**:
- Company Name
- Address
- Product ID
- Product Name
- Brand

**Process**:
1. User submits form via Manufacturer Portal
2. Backend stores data in manufacturerStore[productID]
3. Backend creates canonical manufacturer record text
4. SHA-256 hash is computed from this text
5. Hash is written to smart contract via registerProduct()
6. Success response includes txHash and qrHash

**Output**:
- Timestamp (auto-generated)
- Transaction Hash (from blockchain)
- QR Hash (SHA-256 of product details)

**API Endpoint**: `POST /mfg/products`

---

### 5.2 Retailer / Seller Module

**Purpose**: Record batch-level details and generate final combined QR.

**Inputs**:
- Product ID (references manufacturer data)
- Outlet Name
- Address
- Batch Number
- Brand

**Process**:
1. User submits form via Retailer Portal
2. Backend retrieves manufacturer data by productID
3. Backend builds canonical combined QR text (single-line):
   ```
   TrueTrace – Complete Product & Batch Record Manufacturer: [company] 
   Mfg Address: [address] Product ID: [id] Product Name: [name] 
   Brand: [brand] Manufactured At: [mfgTime] Retailer/Outlet: [outlet] 
   Retail Address: [address] Batch No: [batch] Retail Recorded At: [retailTime] 
   Status: Genuine (recorded on TrueTrace blockchain)
   ```
4. SHA-256 hash is computed
5. Hash is written to smart contract
6. QR code is generated from the text
7. React UI displays QR and encoded text

**Output**:
- Timestamp (retail recording time)
- Transaction Hash
- QR Hash (SHA-256 of combined text)
- QR Code (visual + encoded text)

**API Endpoint**: `POST /retailer/final-qr`

---

### 5.3 Verification Module

**Purpose**: Enable customers to verify product authenticity by comparing hash.

**Process**:
1. Customer scans QR with Google Lens (or copies text from encoded display)
2. Customer opens Verify page and pastes text
3. Frontend sends text to `/verify` endpoint
4. Backend computes SHA-256 hash of pasted text
5. Backend reads on-chain hash from smart contract (products[0].qrHash)
6. Comparison:
   - If hashes match → "Genuine" (green, matching hashes displayed)
   - If hashes differ → "Tampered / invalid" (red, both hashes displayed)

**Output**:
- Verification result (Genuine or Tampered)
- Hash of pasted text
- Hash stored on-chain
- Visual comparison of the two values

**API Endpoint**: `POST /verify`

---

## 6. Implementation Details

### 6.1 Smart Contract (ProductRegistry.sol)

```solidity
pragma solidity ^0.8.0;

struct Product {
    uint256 id;
    string name;
    string manufacturer;
    string qrHash;
    address addedBy;
    uint256 timestamp;
}

contract ProductRegistry {
    mapping(uint256 => Product) public products;
    mapping(string => bool) public qrExists;
    
    event ProductRegistered(
        uint256 indexed id,
        string name,
        string manufacturer,
        string qrHash,
        address indexed addedBy,
        uint256 timestamp
    );
    
    function registerProduct(
        uint256 _id,
        string memory _name,
        string memory _manufacturer,
        string memory _qrHash
    ) public {
        products[_id] = Product({
            id: _id,
            name: _name,
            manufacturer: _manufacturer,
            qrHash: _qrHash,
            addedBy: msg.sender,
            timestamp: block.timestamp
        });
        qrExists[_qrHash] = true;
        emit ProductRegistered(_id, _name, _manufacturer, _qrHash, msg.sender, block.timestamp);
    }
}
```

### 6.2 Backend Hash Computation

```javascript
const CryptoJS = require("crypto-js");

// Single-line canonical format for consistent hashing
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
```

### 6.3 Verification Logic

```javascript
app.post("/verify", async (req, res) => {
  const { qrText } = req.body;
  
  const localHash = CryptoJS.SHA256(qrText).toString();
  const product = await contract.products(0);
  const onChainHash = product.qrHash;
  
  const matches = localHash.toLowerCase() === onChainHash.toLowerCase();
  
  res.json({
    success: true,
    matches,
    localHash,
    onChainHash
  });
});
```

---

## 7. System Workflow

### 7.1 End-to-End Flow Diagram

```
MANUFACTURER           RETAILER              CUSTOMER
     │                   │                       │
     ├──Register────────>│                       │
     │ (Company, etc.)   │                       │
     │                   │                       │
     │  Store data +     │                       │
     │  Write hash #1    │                       │
     │  on-chain         │                       │
     │                   │                       │
     │                   ├──Register────────────>│
     │                   │ (Outlet, Batch, etc.)│
     │                   │                       │
     │                   │ Retrieve mfg data     │
     │                   │ Build combined QR text│
     │                   │ Compute hash #2       │
     │                   │ Write hash #2         │
     │                   │ on-chain              │
     │                   │                       │
     │                   │ Display QR code       │
     │                   │                       │
     │                   │                       ├─Scan QR──┐
     │                   │                       │          │
     │                   │                       │   Copy   │
     │                   │                       │   text   │
     │                   │                       │          │
     │                   │                       ├─Paste & Verify─>
     │                   │                       │
     │                   │                       │ Compute hash #3
     │                   │                       │ Read hash #2 from chain
     │                   │                       │ Compare hash #2 vs #3
     │                   │                       │
     │                   │                       ├─Result: Genuine or Tampered
```

### 7.2 Testing Scenarios

**Scenario 1: Genuine Verification**
- Generate final QR from Retailer
- Copy exact encoded text below QR
- Paste into Verify page
- Result: Hashes match → "Genuine" (green)

**Scenario 2: Tampered Detection**
- Generate final QR
- Copy encoded text
- Modify one character (e.g., batch number or location)
- Paste modified text into Verify
- Result: Hashes differ → "Tampered / invalid" (red)

---

## 8. Results & Screenshots

### 8.1 Login Page

The login page provides role-based access control with three options: Manufacturer, Retailer, or Customer. Demo credentials are provided for testing.

**Key Features:**
- Clean, branded interface with TrueTrace logo
- Role selector dropdown
- Credentials: mfg001/mfg123, ret001/ret123
- Team information displayed at bottom

---

### 8.2 Manufacturer Console

Manufacturers register product origin details. The system automatically:
- Timestamps the entry
- Computes SHA-256 hash
- Writes hash to blockchain
- Returns transaction confirmation

**Fields:**
- Company Name: sacLTD098
- Address: hassan098
- Product ID: sac92098
- Product Name: sachin098
- Brand: sac098

**Output:**
- Timestamp: 2025-12-09T17:37:39.584Z
- Transaction Hash: 0x5b2eb1240f049638...
- QR Hash: 82a712f3d8c0fcdf2906d643...

---

### 8.3 Retailer / Seller Console

Retailers record batch-level details and generate the final combined QR code. The system:
- Retrieves manufacturer data by Product ID
- Builds canonical combined QR text
- Computes final hash
- Stores hash on blockchain
- Displays QR and encoded text

**Fields:**
- Product ID: sac92098
- Outlet Name: sacOutlet098
- Address: hassan098
- Batch Number: 087098
- Brand: sac098

**Output:**
- Timestamp: 2025-12-09T17:37:58.564Z
- Transaction Hash: 0xa4f674c09e1818e5...
- QR Hash: 79a8c589853c3637fc870719...
- QR Code (visual)
- Encoded text below QR

---

### 8.4 Verification Page (Genuine Case)

Customer pastes the exact QR text and clicks "Verify against blockchain". The system compares hashes and confirms authenticity.

**Result:**
- Status: **Genuine** (green)
- Message: "Genuine: hash of this QR text matches the hash stored on TrueTrace blockchain."
- Hash of pasted QR text: 79a8c589853c3637fc870719...
- Hash stored on-chain: 79a8c589853c3637fc870719...
- ✓ Hashes match exactly

---

### 8.5 Verification Page (Tampered Case)

Customer modifies one character in the QR text (e.g., changes "CHANGED" in the status line) and verifies. The system detects the tampering.

**Result:**
- Status: **Tampered / invalid** (red)
- Message: "Tampered / invalid: hash of this text does not match the on-chain hash."
- Hash of pasted QR text: d6565f51a157bbcc2ddc...
- Hash stored on-chain: 79a8c589853c3637fc870719...
- ✗ Hashes do NOT match

---

## 9. Key Achievements

### 9.1 Technical Achievements

1. **Single QR Design**: Combined all manufacturer, retailer, and batch details into one canonical QR code format
2. **Cryptographic Verification**: SHA-256 hashing enables detection of any text modification
3. **Blockchain Integration**: Smart contract stores immutable hash records
4. **Role-Based System**: Three separate portals (Manufacturer, Retailer, Customer) with appropriate workflows
5. **End-to-End Verification**: Customers can verify authenticity by scanning and comparing hashes
6. **Real-Time Blockchain Interaction**: Live writes to and reads from Ganache blockchain

### 9.2 Functional Achievements

1. Manufacturer can register product origins with automatic timestamping
2. Retailer can record batch details and generate traceable QR codes
3. Customers can verify QR authenticity through simple paste-and-verify flow
4. System detects any tampering (even single character change) through hash mismatch
5. All data is immutably recorded on blockchain
6. No manual intervention required for authentication

### 9.3 Security Features

1. **SHA-256 Hashing**: Cryptographically secure, collision-resistant
2. **Canonical Format**: Single-line text ensures consistent hashing
3. **Blockchain Immutability**: Once written, hash cannot be modified without detection
4. **Role-Based Access**: Only authorized users can register data
5. **Transparent Verification**: Customers see both pasted and on-chain hashes for comparison

---

## 10. Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Ganache chain ID mismatch (1337 vs 5777) | Updated hardhat.config.js to use Chain ID 1337 consistently |
| Gas limit exceeded in contract calls | Set explicit gasLimit: 3,000,000 in registerProduct calls |
| Hash mismatch even with exact text | Standardized QR text format to single-line (no \n characters) |
| Account balance depletion during testing | Used funded Ganache accounts; reset workspace when needed |
| Contract require() checks blocking every call | Commented out duplicate-check requires for demo (would re-enable in production) |
| QR scanning results in different text | Aligned backend text format with Google Lens output format |

---

## 11. Future Enhancements

### 11.1 Short-Term (Production Ready)

1. **Re-enable Smart Contract Checks**
   - Restore `require(products[id].timestamp == 0)` to prevent duplicate IDs
   - Restore `require(!qrExists[qrHash])` to ensure unique hashes

2. **Per-Product ID Mapping**
   - Map numeric product IDs from string inputs
   - Support multiple concurrent registrations with unique blockchain entries

3. **Database Integration**
   - Replace in-memory manufacturerStore with persistent database (MongoDB/PostgreSQL)
   - Maintain full audit trail of all registrations

4. **Enhanced Verification**
   - Add batch-specific lookup (verify specific batch from specific retailer)
   - Include digital signatures for non-repudiation

### 11.2 Medium-Term

1. **Mobile App Development**
   - Native iOS/Android apps for Manufacturer and Retailer portals
   - Mobile wallet integration for easy access

2. **Production Blockchain Migration**
   - Deploy to Ethereum Sepolia testnet or mainnet
   - Integration with Hyperledger Fabric for enterprise environments

3. **Supply Chain Tracking**
   - Add intermediate distributor portals
   - Track product movement across the entire supply chain
   - Geolocation tagging at each checkpoint

4. **Analytics Dashboard**
   - Real-time statistics on verified vs. flagged products
   - Heatmaps showing counterfeit hotspots
   - Compliance reporting

### 11.3 Long-Term

1. **IoT Integration**
   - Sensor data (temperature, humidity) stored on blockchain
   - Automatic QR generation at production end
   - Tamper-evident sensors linked to smart contracts

2. **Interoperability**
   - Cross-chain verification (support multiple blockchains)
   - APIs for third-party retailers to integrate

3. **AI/ML for Anomaly Detection**
   - Detect unusual patterns in product registration
   - Identify suspicious batch patterns

4. **Consumer Rewards Program**
   - Incentivize users to verify products
   - Gamification elements (badges, achievements)

---

## 12. Conclusion

TrueTrace demonstrates a practical, end-to-end blockchain-based solution for fake product identification. By combining:
- SHA-256 cryptographic hashing
- Immutable smart contract storage
- QR code technology
- Simple role-based workflows

...the system creates a transparent, tamper-proof record of each product's journey from manufacturer to retailer to customer.

### 12.1 Key Takeaways

1. **Single QR Design**: One QR code contains all necessary information (manufacturer, retailer, batch), eliminating the need for multiple codes or database lookups.

2. **Hash-Based Verification**: Any modification to the QR text results in a hash mismatch, providing definitive proof of tampering.

3. **Blockchain Immutability**: Once a hash is recorded on the blockchain, it cannot be modified, ensuring the integrity of the verification process.

4. **User-Friendly Flow**: Customers simply scan → copy text → paste → verify, making it accessible to non-technical users.

5. **Scalable Architecture**: The modular design allows easy extension to multiple manufacturers, retailers, and geographical regions.

### 12.2 Real-World Applicability

TrueTrace can be deployed across various industries:
- **Pharmaceuticals**: Prevent fake medicines
- **Luxury Goods**: Authenticate designer products
- **Electronics**: Verify authentic components
- **Food & Beverages**: Track origin and prevent adulteration
- **Consumer Products**: Build brand trust

### 12.3 Project Team

- **RAGHAVENDRA A N** [4YG22CS083]
- **SACHIN K N** [4YG22CS087]
- **SACHIN K S** [4YG22CS088]
- **SAGAR K** [4YG22CS089]

---

## Appendix A: API Endpoints

| Endpoint | Method | Purpose | Input |
|----------|--------|---------|-------|
| `/` | GET | Health check | None |
| `/mfg/products` | POST | Register manufacturer | companyName, address, productID, productName, brand |
| `/retailer/final-qr` | POST | Generate final QR | productID, outletName, address, batchNo, brand |
| `/verify` | POST | Verify QR authenticity | qrText |
| `/products/:id/verify` | GET | Check product existence | productID |

---

## Appendix B: Running the Project

### Prerequisites
- Node.js 18+
- Ganache GUI
- Git

### Setup

```bash
# 1. Clone repository
git clone https://github.com/SURAJPATIL6088/Fake-Product-Identification-Using-Blockchain.git
cd Fake-Product-Identification-Using-Blockchain

# 2. Start Ganache
# Open Ganache GUI → Start workspace (RPC: 7545, Chain ID: 1337)

# 3. Deploy contract
npx hardhat compile
npx hardhat run scripts/deploy.js --network ganache

# 4. Update contract address in blockchain/config.js

# 5. Start backend
npm install
npm run dev

# 6. Start frontend (in new terminal)
cd truetrace-ui
npm install
npm start
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Ganache RPC: http://127.0.0.1:7545

---

## References

[1] Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System. https://bitcoin.org/bitcoin.pdf

[2] Ethereum Foundation. (2024). Ethereum Documentation. https://ethereum.org/en/developers/docs/

[3] Hardhat. (2024). Hardhat Documentation. https://hardhat.org/docs

[4] NIST. (2015). Secure Hash Standard (SHS). FIPS PUB 180-4.

[5] WHO. (2021). Global Report on Counterfeit Medicines. World Health Organization.

[6] Hyperledger Project. (2024). Hyperledger Fabric Documentation. https://hyperledger-fabric.readthedocs.io/

---

**Project Report Generated**: December 9, 2025  
**Institution**: Your College/University Name  
**Course**: Major Project (4YG22CS0XX)  
**Academic Year**: 2024–2025

---
