import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App";
import { PlannerProvider } from "./hooks/usePlannerStore";
import { TranslationProvider } from "./hooks/useTranslation";
import { AuthProvider } from "./hooks/useAuth";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TranslationProvider>
          <PlannerProvider>
            <App />
          </PlannerProvider>
        </TranslationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
