import {
  FaHome,
  FaClipboardList,
  FaTools,
  FaChartBar,
  FaUsers,
  FaUserShield,

} from "react-icons/fa";

const sidebarConfig = {
  CLIENT: [],

  ARTISAN: [
    {
      label: "Tableau de bord",
      path: "/artisan/dashboard",
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
      path: "/admin/dashboard",
      icon: FaChartBar,
    },
    {
      label: "Gestion des Utilisateurs",
      path: "",
      icon: FaUsers,
    },
    {
      label: "Validation des Artisans",
      path: "",
      icon: FaUserShield,
    },
  ],};

export default sidebarConfig;