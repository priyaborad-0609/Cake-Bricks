import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowed, children }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/signin" />;
  if (!allowed.includes(user.role)) return <Navigate to="/signin" />;

  return children;
};

export default ProtectedRoute;
