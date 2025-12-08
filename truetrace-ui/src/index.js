import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import ManufacturerPage from "./pages/ManufacturerPage";
import RetailerPage from "./pages/RetailerPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/manufacturer" element={<ManufacturerPage />} />
        <Route path="/retailer" element={<RetailerPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
