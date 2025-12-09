import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

// Very simple demo users (front-end only, OK for college project)
const USERS = {
  manufacturer: { id: "mfg001", password: "mfg123" },
  retailer: { id: "ret001", password: "ret123" },
  seller: { id: "sel001", password: "sel123" }
};

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manufacturer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const expected = USERS[role];

    if (userId === expected.id && password === expected.password) {
      if (role === "manufacturer") {
        navigate("/manufacturer");
      } else {
        // retailer and seller share same page for now
        navigate("/retailer");
      }
    } else {
      setError("Invalid credentials for selected role.");
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-header">
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
          <div>
            <h1>TrueTrace</h1>
            <p>Secure access for supply chain partners</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="manufacturer">Manufacturer</option>
              <option value="retailer">Retailer</option>
              <option value="seller">Seller</option>
            </select>
          </label>

          <label>
            User ID
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <div className="login-footer">
          <p>TrueTrace Team</p>
          <p>RAGHAVENDRA A N [4YG22CS083]</p>
          <p>SACHIN K N [4YG22CS087]</p>
          <p>SACHIN K S [4YG22CS088]</p>
          <p>SAGAR K [4YG22CS089]</p>
        </div>
      </div>
    </div>
  );
}
