import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App";
import { PlannerProvider } from "./hooks/usePlannerStore";
import { TranslationProvider } from "./hooks/useTranslation";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TranslationProvider>
        <PlannerProvider>
          <App />
        </PlannerProvider>
      </TranslationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
