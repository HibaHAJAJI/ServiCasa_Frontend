import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FaUsers,
  FaUserTie,
  FaUserShield,
  FaClipboardList,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import adminDashboardService from "../../services/adminDashboardService";

const DashboardAdmin = () => {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalArtisans: 0,
    totalReservations: 0,
    pendingReservations: 0,
    completedReservations: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await adminDashboardService.getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Erreur dashboard admin :", error);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Total Utilisateurs",
      value: dashboard.totalUsers,
      icon: FaUsers,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Total Clients",
      value: dashboard.totalClients,
      icon: FaUserShield,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
    {
      title: "Total Artisans",
      value: dashboard.totalArtisans,
      icon: FaUserTie,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
    },
    {
      title: "Total Réservations",
      value: dashboard.totalReservations,
      icon: FaClipboardList,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50",
    },
    {
      title: "Réservations en attente",
      value: dashboard.pendingReservations,
      icon: FaHourglassHalf,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      title: "Réservations terminées",
      value: dashboard.completedReservations,
      icon: FaCheckCircle,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
              Activité récente de la plateforme
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between border-b border-gray-100 py-4">
              <div>
                <p className="font-medium text-[#0B1F3A]">
                  Système opérationnel
                </p>

                <p className="text-sm text-gray-500">
                  Toutes les statistiques sont synchronisées en temps réel.
                </p>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700 font-semibold whitespace-nowrap">
                Actif
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAdmin;