// src/components/sidebar/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/auth/AuthContext";
import sidebarConfig from "../../config/sidebarConfig";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const role = user?.role ? user.role.replace("ROLE_", "").toUpperCase() : "ARTISAN";
  const menuItems = sidebarConfig[role] || [];

  const profilePath = role === "CLIENT" ? "/client/profile" : "/profile";

  return (
    <aside 
      className={`w-64 h-[calc(100vh-70px)] bg-white border-r border-slate-200 fixed left-0 top-[70px] flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out shadow-lg md:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <nav className="p-4 space-y-1.5 overflow-y-auto" onClick={onClose}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/artisan/dashboard" || item.path === "/client/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#0B1F3A] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-[#0B1F3A]"
                }`
              }
            >
              <Icon className="text-lg" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Mon profil — chemin dynamique selon le rôle */}
        <NavLink
          to={profilePath}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#0B1F3A] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-[#0B1F3A]"
            }`
          }
        >
          <FaUser className="text-lg" />
          <span>Mon profil</span>
        </NavLink>
      </nav>

      {/* Déconnexion */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
