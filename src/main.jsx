import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App";
import { PlannerProvider } from "./hooks/usePlannerStore";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlannerProvider>
        <App />
      </PlannerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
