import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function RoleGuard({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleGuard;