import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaTools

} from "react-icons/fa";

const sidebarConfig = {
  CLIENT: [],

  ARTISAN: [],

  ADMIN: [
     {
      label: "Dashboard",
      path: "/dashboard/admin",
      icon: FaHome,
    },
    {
      label: "Clients",
      path: "/admin/clients",
      icon: FaUsers,
    },
    {
      label: "Artisans",
      path: "/admin/artisans",
      icon: FaTools,
    },
    {
      label: "Réservations",
      path: "/admin/reservations",
      icon: FaCalendarAlt,
    },
  ],
};

export default sidebarConfig;