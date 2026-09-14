import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function RoleGuard({ allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = jwtDecode(token);
  } catch {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleGuard;