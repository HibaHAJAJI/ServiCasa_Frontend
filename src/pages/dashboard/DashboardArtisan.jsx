// src/pages/artisan/DashboardArtisan.jsx
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  FaClipboardList,
  FaTools,
  FaCheckCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

import artisanDashboardService from "../../services/artisanDashboardService";

import Sidebar from "@/components/sidebar/Sidebar";
import Navbar from "@/components/navbar/PrivateNavbar";

const DashboardArtisan = () => {
  const [dashboard, setDashboard] = useState({
    nouvellesDemandes: 0,
    interventionsEnCours: 0,
    interventionsTerminees: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const artisanId = 1;
        const data = await artisanDashboardService.getDashboard(artisanId);
        setDashboard(data);
      } catch (error) {
        console.error("Erreur dashboard :", error);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Nouvelles demandes",
      value: dashboard.nouvellesDemandes,
      icon: FaClipboardList,
      // Couleurs spécifiques l'icône: Bleu
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Interventions en cours",
      value: dashboard.interventionsEnCours,
      icon: FaTools,
      // Couleurs spécifiques l'icône: Orange/Amber
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      title: "Interventions terminées",
      value: dashboard.interventionsTerminees,
      icon: FaCheckCircle,
      // Couleurs spécifiques l'icône: Vert/Emerald
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      title: "Revenus du mois",
      value: "0 DH",
      icon: FaMoneyBillWave,
      // Couleurs spécifiques l'icône: Indigo/Purple
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-[70px]">
        <Sidebar />

        <main className="flex-1 ml-0 md:ml-[240px] p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  key={stat.title}
                  className="border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                      <Icon className={`${stat.iconColor} text-lg`} />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-3xl font-extrabold text-[#0B1F3A]">
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#0B1F3A]">
                  Mes demandes récentes
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between border-b border-gray-100 py-4">
                  <div>
                    <p className="font-medium text-[#0B1F3A]">
                      Aucune demande récente
                    </p>
                    <p className="text-sm text-gray-500">
                      Les nouvelles demandes apparaîtront ici.
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    Aucune
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardArtisan;