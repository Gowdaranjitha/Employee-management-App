import { Navigate } from "react-router-dom";
import "./RoleBasedRoute.css";

function RoleBasedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleBasedRoute;
