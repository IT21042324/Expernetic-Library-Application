import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const UseAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("useAuth must be used within an AuthProvider");

  return authContext;
};
