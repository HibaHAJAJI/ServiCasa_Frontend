import {
  FaHome,
  FaClipboardList,
  FaTools,
  FaChartBar,
  FaUserShield,
  FaFolder,

} from "react-icons/fa";

const sidebarConfig = {
  CLIENT: [],

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