import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "../App.css";

export default function RetailerForm() {
  const [form, setForm] = useState({
    productID: "",
    outletName: "",
    address: "",
    batchNo: "",
    brand: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitDetails = async (e) => {
  e.preventDefault();
  setLoading(true);
  setResult(null);

  try {
    const res = await axios.post("http://localhost:5000/retailer/final-qr", {
      productID: form.productID,
      outletName: form.outletName,
      address: form.address,
      batchNo: form.batchNo,
      brand: form.brand
    });
    setResult(res.data);
  } catch (err) {
    setResult({
      success: false,
      error: err.response?.data?.error || err.message
    });
  } finally {
    setLoading(false);
  }
};


  const qrText = result?.success ? result.qrText : null;

  return (
    <div className="app-root">
      <header className="app-header">
        <a
          href="/"
          style={{
            marginRight: "16px",
            fontSize: "0.85rem",
            color: "#9ca3af",
            textDecoration: "none"
          }}
        >
          Logout
        </a>
        <img
            src={require("../assets/logo.png")}
            alt="TrueTrace logo"
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              objectFit: "cover",
              marginRight: 12
            }}
          />
        <div className="header-text">
          <a
            href="/verify"
            style={{
              marginLeft: "auto",
              fontSize: "0.85rem",
              color: "#a5b4fc",
              textDecoration: "none"
            }}
          >
            Verify QR
          </a>
          <h1>TrueTrace – Retailer / Seller Console</h1>
          <p className="subtitle">
            Capture batch-level details and generate traceable QR codes.
          </p>
        </div>
      </header>

      <main className="main-layout">
        <section className="card">
          <h2>Retailer / Seller Portal</h2>
          <p className="section-desc">
            Enter your outlet details and batch information. TrueTrace will
            timestamp, generate QR payload for the batch, hash it, and store the
            hash on-chain.
          </p>

          <form className="form" onSubmit={submitDetails}>
            <label>
              Product ID
              <input
                type="text"
                name="productID"
                value={form.productID}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Outlet Name
              <input
                type="text"
                name="outletName"
                value={form.outletName}
                onChange={handleChange}
                required
             />
            </label>

            <label>
              Address
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Batch Number
              <input
                type="text"
                name="batchNo"
                value={form.batchNo}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Brand
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save & Generate QR"}
            </button>
          </form>

          {result && (
            <div className="result-panel">
              {result.success ? (
                <>
                  <p className="status success">
                    Batch details recorded on blockchain successfully.
                  </p>
                  <p>
                    Timestamp:{" "}
                    <span className="mono">{result.timestamp}</span>
                  </p>
                  <p>
                    Transaction Hash:{" "}
                    <span className="mono">
                      {result.txHash.substring(0, 18)}...
                    </span>
                  </p>
                  <p>
                    QR Hash (on-chain):{" "}
                    <span className="mono">
                      {result.qrHash.substring(0, 24)}...
                    </span>
                  </p>
                </>
              ) : (
                <p className="status error">Error: {result.error}</p>
              )}
            </div>
          )}
        </section>

        <section className="card">
          <h2>Batch QR Code</h2>
          <p className="section-desc">
            This QR encodes retailer/seller and batch details. Customers scanning
            with Google Lens can see where the batch was sold from.
          </p>

          {qrText ? (
            <div className="qr-block">
              <QRCodeCanvas value={qrText} size={190} />
              <p className="hint">
                Encoded text:
                <br />
                <span className="mono small">{qrText}</span>
              </p>
            </div>
          ) : (
            <p className="section-desc">
              Submit batch details to generate a QR code.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
