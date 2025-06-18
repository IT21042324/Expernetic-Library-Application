import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CustomProvider } from "rsuite";
import App from "./App.tsx";
import AlertContextProvider from "./context/AlertContext.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import BookContextProvider from "./context/BookContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CustomProvider theme="dark">
      <AuthContextProvider>
        <BookContextProvider>
          <AlertContextProvider>
            <App />
          </AlertContextProvider>
        </BookContextProvider>
      </AuthContextProvider>
    </CustomProvider>
  </StrictMode>
);
