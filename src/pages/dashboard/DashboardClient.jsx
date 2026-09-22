import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaFlagCheckered,
} from "react-icons/fa";

import reservationService from "@/services/reservationService";

const statutLabel = {
  EN_ATTENTE: "En attente",
  ACCEPTEE: "Acceptée",
  REFUSEE: "Refusée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

const statutColor = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-700",
  ACCEPTEE: "bg-blue-100 text-blue-700",
  REFUSEE: "bg-red-100 text-red-700",
  EN_COURS: "bg-purple-100 text-purple-700",
  TERMINEE: "bg-green-100 text-green-700",
  ANNULEE: "bg-slate-100 text-slate-500",
};

const DashboardClient = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReservations = async () => {
      try {
        const data = await reservationService.getMyReservations();

        if (active) {
          setReservations(data.content || []);
        }
      } catch (error) {
        console.error(error);

        if (active) {
          setError("Impossible de charger vos réservations.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadReservations();

    return () => {
      active = false;
    };
  }, []);

  const total = reservations.length;

  const enAttente = reservations.filter(
    (r) => r.statutReservation === "EN_ATTENTE"
  ).length;

  const acceptees = reservations.filter(
    (r) => r.statutReservation === "ACCEPTEE"
  ).length;

  const terminees = reservations.filter(
    (r) => r.statutReservation === "TERMINEE"
  ).length;

  const stats = [
    {
      title: "Réservations",
      value: total,
      icon: FaClipboardList,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "En attente",
      value: enAttente,
      icon: FaClock,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-50",
    },
    {
      title: "Acceptées",
      value: acceptees,
      icon: FaCheckCircle,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Terminées",
      value: terminees,
      icon: FaFlagCheckered,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
  ];

  const dernieres = reservations.slice(0, 3);

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
                  {loading ? "..." : stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6">
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-[#0B1F3A]">
              Mes dernières réservations
            </CardTitle>

            <Link
              to="/client/reservations"
              className="text-sm font-medium text-[#0B1F3A] hover:underline"
            >
              Voir tout
            </Link>
          </CardHeader>

          <CardContent>
            {loading && (
              <p className="py-4 text-center text-sm text-slate-500">
                Chargement...
              </p>
            )}

            {!loading && error && (
              <p className="py-4 text-center text-sm text-red-500">
                {error}
              </p>
            )}

            {!loading && !error && dernieres.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-500">
                Vous n'avez aucune réservation pour le moment.
              </p>
            )}

            {!loading && !error && dernieres.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="px-4 py-3 font-medium text-slate-500">
                        Artisan
                      </th>

                      <th className="px-4 py-3 font-medium text-slate-500">
                        Spécialité
                      </th>

                      <th className="px-4 py-3 font-medium text-slate-500">
                        Date
                      </th>

                      <th className="px-4 py-3 font-medium text-slate-500">
                        Statut
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {dernieres.map((reservation) => (
                      <tr
                        key={reservation.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-4 py-4 font-medium text-[#0B1F3A]">
                          {reservation.artisanPrenom
                            ? `${reservation.artisanPrenom} ${
                                reservation.artisanNom || ""
                              }`
                            : `Artisan #${reservation.artisanId}`}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {reservation.artisanSpecialite || "-"}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {reservation.dateIntervention
                            ? new Date(
                                reservation.dateIntervention
                              ).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Date non définie"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              statutColor[reservation.statutReservation] ||
                              "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {statutLabel[reservation.statutReservation] ||
                              reservation.statutReservation}
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

export default DashboardClient;