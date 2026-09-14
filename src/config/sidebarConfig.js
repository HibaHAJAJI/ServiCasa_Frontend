import {
  FaHome,
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";

const sidebarConfig = {
  CLIENT: [
    {
      label: "Tableau de bord",
      path: "/client",
      icon: FaHome,
    },
    {
      label: "Rechercher un artisan",
      path: "/client/artisans",
      icon: FaSearch,
    },
    {
      label: "Mes réservations",
      path: "/client/reservations",
      icon: FaCalendarAlt,
    },
  ],

  ARTISAN: [],

  ADMIN: [],
};

export default sidebarConfig;