import {
  FaHome,
  FaClipboardList,
  FaTools

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

  ADMIN: [],
};

export default sidebarConfig;