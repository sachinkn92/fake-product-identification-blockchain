import React, { useState } from "react";
import axios from "axios";
import "../App.css";

export default function VerifyPage() {
  const [qrText, setQrText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("http://localhost:5000/verify", { qrText });
      setResult(res.data);
    } catch (err) {
      setResult({
        error: err.response?.data?.error || err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const matches = result?.matches;

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
          <h1>TrueTrace – Verify QR</h1>
          <p className="subtitle">
            Paste QR text (from Google Lens) and check it against blockchain.
          </p>
        </div>
      </header>

      <main className="main-layout">
        <section className="card">
          <h2>Verification Input</h2>
          <p className="section-desc">
            Copy the full text you see after scanning the QR with Google Lens
            and paste it here.
          </p>

          <form className="form" onSubmit={handleVerify}>
            <label>
              QR Text
              <textarea
                rows={8}
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                required
                style={{
                  background: "rgba(15,23,42,0.9)",
                  borderRadius: 10,
                  border: "1px solid rgba(148,163,184,0.7)",
                  padding: "8px 10px",
                  color: "#e5e7eb",
                  fontFamily: "monospace",
                  fontSize: "0.85rem"
                }}
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify against blockchain"}
            </button>
          </form>

          {result && (
            <div className="result-panel">
              {result.error ? (
                <p className="status error">Error: {result.error}</p>
              ) : matches ? (
                <p className="status success">
                  Genuine: hash of this QR text matches the hash stored on
                  TrueTrace blockchain.
                </p>
              ) : (
                <p className="status error">
                  Tampered / invalid: hash of this text does not match the
                  on-chain hash.
                </p>
              )}

              {result.localHash && (
                <>
                  <p>Hash of pasted QR text:</p>
                  <p className="mono small">{result.localHash}</p>
                </>
              )}

              {result.onChainHash && (
                <>
                  <p>Hash stored on-chain:</p>
                  <p className="mono small">{result.onChainHash}</p>
                </>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
