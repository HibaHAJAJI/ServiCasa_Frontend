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
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">
          Chargement en cours...
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs w-full">
      <div className="w-full">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Client
              </TableHead>
              <TableHead className="border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Artisan
              </TableHead>
              <TableHead className="border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </TableHead>
              <TableHead className="border border-slate-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Statut
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="border border-slate-200 py-8 text-center text-sm text-slate-500"
                >
                  Aucune réservation récente
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="border border-slate-200 px-4 py-3 font-medium text-[#0B1F3A]">
                    {item.clientNom}
                  </TableCell>
                  <TableCell className="border border-slate-200 px-4 py-3 text-sm text-slate-600">
                    {item.artisanNom || "Non assigné"}
                  </TableCell>
                  <TableCell className="border border-slate-200 px-4 py-3 text-sm text-slate-600">
                    {item.dateReservation}
                  </TableCell>
                  <TableCell className="border border-slate-200 px-4 py-3 text-center">
                    <span
                      className={`inline-flex min-w-[90px] justify-center rounded-full px-2.5 py-1 text-xs font-medium ${
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LatestReservationsAdmin;