import { Navigate } from "react-router-dom";
import { UseAuthContext } from "../../context/useAuthContext";

type PrivateRouteProps = {
  children: React.JSX.Element;
};

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = UseAuthContext();

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
