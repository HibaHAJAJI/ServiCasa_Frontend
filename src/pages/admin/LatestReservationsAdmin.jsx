import { useEffect, useState } from "react";
import reservationService from "../../services/reservationService";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LatestReservationsAdmin = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await reservationService.getLatestReservations(0, 5);
        setReservations(data.content || data);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <p className="text-sm text-slate-500">
          Chargement en cours...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-[#0B1F3A]">
          Dernières réservations
        </h3>
      </div>

      <div className="overflow-x-auto">
        <Table>

          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">

              <TableHead className="h-11 px-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Client
              </TableHead>

              <TableHead className="h-11 px-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Artisan
              </TableHead>

              <TableHead className="h-11 px-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </TableHead>

              <TableHead className="h-11 px-6 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Statut
              </TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>
            {reservations.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
              >

                <TableCell className="px-6 py-3.5">
                  <span className="font-medium text-[#0B1F3A]">
                    {item.clientNom}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-3.5 text-sm text-slate-600">
                  {item.artisanNom || "Non assigné"}
                </TableCell>

                <TableCell className="px-6 py-3.5 text-sm text-slate-600">
                  {item.dateReservation}
                </TableCell>

                <TableCell className="px-6 py-3.5 text-right">
                  <span
                    className={`inline-flex min-w-[90px] justify-center rounded-full px-3 py-1 text-xs font-medium
                      ${
                        item.statut === "EN_ATTENTE"
                          ? "bg-amber-50 text-amber-700"
                          : item.statut === "ACCEPTEE"
                          ? "bg-blue-50 text-blue-700"
                          : item.statut === "TERMINEE"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.statut === "REFUSEE"
                          ? "bg-red-50 text-red-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {item.statut}
                  </span>
                </TableCell>

              </TableRow>
            ))}

            {reservations.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-sm text-slate-500"
                >
                  Aucune réservation récente
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>
    </div>
  );
};

export default LatestReservationsAdmin;