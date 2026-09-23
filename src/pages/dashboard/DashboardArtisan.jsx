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

import artisanDashboardService from "@/services/artisanDashboardService";
import reservationService from "@/services/reservationService";

const DashboardArtisan = () => {
  const [dashboard, setDashboard] = useState({
    nouvellesDemandes: 0,
    interventionsEnCours: 0,
    interventionsTerminees: 0,
  });

  const [demandes, setDemandes] = useState([]);
  const [loadingDemandes, setLoadingDemandes] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await artisanDashboardService.getDashboard();

        setDashboard({
          nouvellesDemandes: data?.nouvellesDemandes ?? 0,
          interventionsEnCours: data?.interventionsEnCours ?? 0,
          interventionsTerminees: data?.interventionsTerminees ?? 0,
        });
      } catch (error) {
        console.error("Erreur dashboard :", error);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const loadDemandes = async () => {
      try {
        const data = await reservationService.getPendingReservations();

        const reservations = Array.isArray(data)
          ? data
          : data?.content || data?.data || [];

        setDemandes(reservations.slice(0, 3));
      } catch (error) {
        console.error("Erreur chargement demandes :", error);
        setDemandes([]);
      } finally {
        setLoadingDemandes(false);
      }
    };

    loadDemandes();
  }, []);

  const stats = [
    {
      title: "Nouvelles demandes",
      value: dashboard.nouvellesDemandes,
      icon: FaClipboardList,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Interventions en cours",
      value: dashboard.interventionsEnCours,
      icon: FaTools,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      title: "Interventions terminées",
      value: dashboard.interventionsTerminees,
      icon: FaCheckCircle,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      title: "Revenus du mois",
      value: "0 DH",
      icon: FaMoneyBillWave,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="mt-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#0B1F3A]">
              Mes demandes récentes
            </CardTitle>
          </CardHeader>

          <CardContent>
            {loadingDemandes ? (
              <div className="py-6 text-center">
                <p className="text-sm text-gray-500">
                  Chargement des demandes...
                </p>
              </div>
            ) : demandes.length === 0 ? (
              <div className="py-6 text-center">
                <p className="font-medium text-[#0B1F3A]">
                  Aucune demande récente
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Les nouvelles demandes apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-sm font-semibold text-gray-500">
                        Client
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-gray-500">
                        Problème
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-gray-500">
                        Date
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-gray-500">
                        Statut
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {demandes.map((demande) => (
                      <tr
                        key={demande.id}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="px-4 py-4">
                          <p className="font-medium text-[#0B1F3A]">
                            {demande.clientPrenom || ""}{" "}
                            {demande.clientNom || ""}
                          </p>
                        </td>

                        <td className="max-w-xs px-4 py-4">
                          <p className="truncate text-sm text-gray-600">
                            {demande.descriptionProbleme ||
                              "Aucune description"}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-500">
                          {demande.dateIntervention
                            ? new Date(
                                demande.dateIntervention
                              ).toLocaleDateString("fr-FR")
                            : demande.dateReservation
                              ? new Date(
                                  demande.dateReservation
                                ).toLocaleDateString("fr-FR")
                              : "Date non définie"}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                            En attente
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardArtisan;