import { NavLink } from "react-router-dom";
import {FaUser, FaSignOutAlt} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import sidebarConfig from "../../config/sidebarConfig";

import "./Sidebar.css";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const role = user?.role?.replace("ROLE_", "").toUpperCase();
  const menuItems = sidebarConfig[role] || [];

  return (
    <aside className="sidebar">

      <nav className="sidebar-menu">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              } >
              <Icon className="sidebar-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <FaUser className="sidebar-icon" />
          <span>Mon profil</span>
        </NavLink>

      </nav>

      <div className="sidebar-bottom">

        <button
          className="logout-button"
          onClick={logout}
        >
          <FaSignOutAlt className="sidebar-icon" />
          <span>Déconnexion</span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;