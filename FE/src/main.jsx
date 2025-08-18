// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ToastPortal from "./components/common/ToastPortal"; // ✅ 추가

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
    <ToastPortal />
  </BrowserRouter>
  // </React.StrictMode>
);
