import {
  FaHome,
  FaClipboardList,
  FaTools,
  FaChartBar,
  FaUserShield,
  FaFolder,
  FaCalendarAlt,
  FaStar,
  FaClock,
  FaWrench,
} from "react-icons/fa";

const sidebarConfig = {
  CLIENT: [
    {
      label: "Tableau de bord",
      path: "/client/dashboard",
      icon: FaHome,
    },
    {
      label: "Mes réservations",
      path: "/client/reservations",
      icon: FaCalendarAlt,
    },
  ],

  ARTISAN: [
    {
      label: "Tableau de bord",
      path: "/dashboard/artisan",
      icon: FaHome,
    },
    {
      label: "Nouvelles demandes",
      path: "/artisan/demandes",
      icon: FaClipboardList,
    },
    {
      label: "Interventions",
      path: "/artisan/interventions",
      icon: FaTools,
    },
    {
      label: "Disponibilités",
      path: "/artisan/disponibilites",
      icon: FaClock,
    },
    {
      label: "Mes services",
      path: "/artisan/services",
      icon: FaWrench,
    },
    {
      label: "Mes avis",
      path: "/artisan/avis",
      icon: FaStar,
    },
  ],

  ADMIN: [
    {
      label: "Tableau de bord",
      path: "/dashboard/admin",
      icon: FaChartBar,
    },
    {
      label: "Validation des Artisans",
      path: "/admin/artisans/validation",
      icon: FaUserShield,
    },
    {
      label: "Gestion des Catégories",
      path: "/admin/categories",
      icon: FaFolder,
    },
    {
      label: "Réservations",
      path: "/admin/reservations",
      icon: FaClipboardList,
    },

  ],
};

export default sidebarConfig;