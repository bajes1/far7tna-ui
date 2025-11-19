// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import AuthProvider from "./auth/AuthProvider";

const theme = createTheme({ palette:{mode:"light"}, shape:{borderRadius:12} });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AuthProvider>
        <App/>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
