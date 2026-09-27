import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const roleHome = {
  ROLE_ARTISAN: "/dashboard/artisan",
  ROLE_CLIENT: "/client/dashboard",
  ROLE_ADMIN: "/dashboard/admin",
};

function RoleGuard({ allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let role;
  try {
    role = jwtDecode(token).role;
  } catch {
    role = null;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={roleHome[role] || "/login"} replace />;
  }

  return <Outlet />;
}

export default RoleGuard;
