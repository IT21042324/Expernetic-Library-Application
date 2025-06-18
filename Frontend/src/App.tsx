// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home/Home";
import LoginSignup from "./page/Authorization/LoginSignup";
import PrivateRoute from "./page/Authorization/PrivateRoute";
import { AlertToast } from "./component/Alert/Alert";

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <AlertToast />
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
