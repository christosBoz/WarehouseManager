import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkBlueTheme from "./site_wide/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={darkBlueTheme}>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
