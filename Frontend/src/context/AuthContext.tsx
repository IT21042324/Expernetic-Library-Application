import React, { createContext, useEffect, useState } from "react";
import type { AuthContextType } from "../lib/type";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token")
  );

  useEffect(() => {
    const localToken = localStorage.getItem("auth_token");
    if (localToken && !token) {
      setToken(localToken);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
