import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App.js";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// renders React Component "Root" into the DOM element with ID "root"
const GOOGLE_CLIENT_ID = "111532973746-seocmk0fff7s6feauriigvt11359c5td.apps.googleusercontent.com"
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
);

// allows for live updating
module.hot.accept();
