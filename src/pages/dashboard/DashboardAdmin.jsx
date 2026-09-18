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
import LatestReservationsAdmin from "../admin/LatestReservationsAdmin";
import PendingArtisansAdmin from "../admin/PendingArtisansAdmin";

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
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
        
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#0B1F3A] px-1">
            Dernières réservations
          </h3>
          <LatestReservationsAdmin />
        </div>
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#0B1F3A] px-1">
            Validation des artisans
          </h3>
          <PendingArtisansAdmin />
        </div>

      </div>
    </div>
  );
};

export default DashboardAdmin;