import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "../App.css"; // reuse main styling

export default function ManufacturerForm() {
  const [form, setForm] = useState({
    companyName: "",
    address: "",
    productID: "",
    productName: "",
    brand: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // backend will add timestamp and hash
      const res = await axios.post("http://localhost:5000/mfg/products", {
        companyName: form.companyName,
        address: form.address,
        productID: form.productID,
        productName: form.productName,
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

          <h1>TrueTrace – Manufacturer Console</h1>
          <p className="subtitle">
            Register product origins and generate QR codes backed by blockchain.
          </p>
        </div>
      </header>

      <main className="main-layout">
        <section className="card">
          <h2>Manufacturer Portal</h2>
          <p className="section-desc">
            Enter company and product details. TrueTrace will timestamp,
            generate the QR payload, hash it, and store the hash on-chain.
          </p>

          <form className="form" onSubmit={registerProduct}>
            <label>
              Company Name
              <input
                type="text"
                name="companyName"
                value={form.companyName}
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
              Product Name
              <input
                type="text"
                name="productName"
                value={form.productName}
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
              {loading ? "Registering..." : "Register & Generate QR"}
            </button>
          </form>

          {result && (
            <div className="result-panel">
              {result.success ? (
                <>
                  <p className="status success">
                    Product registered on blockchain successfully.
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
          <h2>Product QR Code</h2>
          <p className="section-desc">
            This QR encodes all manufacturer details. When scanned with Google
            Lens, customers see the full text.
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
              Register a product to generate its QR code.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
