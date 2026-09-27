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
  FaUserClock,
} from "react-icons/fa";

import adminDashboardService from "../../services/adminDashboardService";
import LatestReservationsAdmin from "@/pages/admin/LatestReservationsAdmin";

const DashboardAdmin = () => {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalArtisans: 0,
    totalReservations: 0,
    pendingReservations: 0,
    completedReservations: 0,
    pendingArtisans: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminDashboardService.getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Erreur dashboard admin :", error);
        setError("Impossible de charger le tableau de bord.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(7)].map((_, i) => (
            <Card key={i} className="border-gray-200 bg-white shadow-sm animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  <span className="h-4 w-24 bg-gray-200 rounded" />
                </CardTitle>
                <div className="h-10 w-10 rounded-xl bg-gray-200" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-extrabold text-gray-200">
                  <span className="h-8 w-16 bg-gray-200 rounded inline-block" />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 text-center">
        <p className="font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-red-600 hover:underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

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
      title: "Artisans en attente",
      value: dashboard.pendingArtisans,
      icon: FaUserClock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
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
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>

                <div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full">

        <div className="min-w-0 space-y-3">
          <h3 className="text-base font-bold text-[#0B1F3A] px-1">
            Dernières réservations
          </h3>

          <div className="w-full overflow-x-auto">
            <LatestReservationsAdmin />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardAdmin;