import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    id: "",
    name: "",
    manufacturer: ""
  });
  const [registerResult, setRegisterResult] = useState(null);
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegisterResult(null);
    try {
      const res = await axios.post("http://localhost:5000/products", {
        id: Number(form.id),
        name: form.name,
        manufacturer: form.manufacturer
      });
      setRegisterResult(res.data);
    } catch (err) {
      setRegisterResult({
        success: false,
        error: err.response?.data?.error || err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerifyResult(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/products/${verifyId}/verify`
      );
      setVerifyResult(res.data);
    } catch (err) {
      setVerifyResult({
        error: err.response?.data?.error || err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const qrValue =
    registerResult && registerResult.success
      ? registerResult.rawData
      : null;

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo-mark">TT</div>
        <div className="header-text">
          <h1>TrueTrace</h1>
          <p className="subtitle">
            Blockchain-based Fake Product Identification System
          </p>
        </div>
      </header>

      <main className="main-layout">
        <section className="card">
          <h2>Manufacturer Portal</h2>
          <p className="section-desc">
            Register genuine products on the TrueTrace blockchain.
          </p>

          <form className="form" onSubmit={registerProduct}>
            <label>
              Product ID
              <input
                type="number"
                name="id"
                value={form.id}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Product Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Manufacturer
              <input
                type="text"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register Product"}
            </button>
          </form>

          {registerResult && (
            <div className="result-panel">
              {registerResult.success ? (
                <>
                  <p className="status success">
                    Product registered on blockchain successfully.
                  </p>
                  <p>
                    Transaction Hash:{" "}
                    <span className="mono">
                      {registerResult.txHash.substring(0, 18)}...
                    </span>
                  </p>
                  <p>
                    QR Payload (rawData):{" "}
                    <span className="mono">{registerResult.rawData}</span>
                  </p>
                  <p>
                    QR Hash (stored on-chain):{" "}
                    <span className="mono">
                      {registerResult.qrHash.substring(0, 24)}...
                    </span>
                  </p>

                  {qrValue && (
                    <div className="qr-block">
                      <h3>Product QR Code</h3>
                      <QRCodeCanvas value={qrValue} size={160} />
                      <p className="hint">
                        Encode this QR on the product packaging. The payload is:
                        <br />
                        <span className="mono small">{qrValue}</span>
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="status error">
                  Error: {registerResult.error}
                </p>
              )}
            </div>
          )}
        </section>

        <section className="card">
          <h2>Customer Verification</h2>
          <p className="section-desc">
            Enter the Product ID from the QR payload to verify authenticity.
          </p>

          <form className="form inline" onSubmit={verifyProduct}>
            <input
              type="number"
              placeholder="Product ID"
              value={verifyId}
              onChange={(e) => setVerifyId(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Verify"}
            </button>
          </form>

          {verifyResult && (
            <div className="result-panel">
              {verifyResult.exists ? (
                <p className="status success">
                  Genuine product. Record found on TrueTrace blockchain.
                </p>
              ) : verifyResult.exists === false ? (
                <p className="status error">
                  Fake / unregistered product. No record found.
                </p>
              ) : (
                <p className="status error">
                  Error: {verifyResult.error}
                </p>
              )}
            </div>
          )}

          <div className="info-box">
            <h3>How it works</h3>
            <ul>
              <li>
                Manufacturer registers product on-chain with a cryptographic
                QR hash.
              </li>
              <li>
                QR code encodes a safe payload like{" "}
                <span className="mono">id|name|manufacturer</span>.
              </li>
              <li>
                Customer verifies against blockchain using TrueTrace.
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-left">
          <h3>TrueTrace Team</h3>
          <p>
            RAGHAVENDRA A N <span className="mono">[4YG22CS083]</span>
          </p>
          <p>
            SACHIN K N <span className="mono">[4YG22CS087]</span>
          </p>
          <p>
            SACHIN K S <span className="mono">[4YG22CS088]</span>
          </p>
          <p>
            SAGAR K <span className="mono">[4YG22CS089]</span>
          </p>
        </div>
        <div className="footer-right">
          <p className="project-meta">
            TrueTrace &mdash; Fake Product Identification System Using
            Blockchain
          </p>
          <p className="project-meta">
            Department of CSE, Navkis College of Engineering, VTU.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
