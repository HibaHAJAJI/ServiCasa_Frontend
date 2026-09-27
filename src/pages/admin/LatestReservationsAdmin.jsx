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
        const data = await reservationService.getAllReservations(0, 5, "", "");
        const list = Array.isArray(data) ? data : data?.content || [];
        setReservations(list);
      } catch (error) {
        console.error("Erreur:", error);
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
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Client</TableHead>
            <TableHead>Artisan</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Statut</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-8 text-center text-sm text-slate-500"
              >
                Aucune réservation récente
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((item) => {
              const statut = item.statutReservation;

              return (
                <TableRow
                  key={item.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <TableCell className="font-medium text-[#0B1F3A]">
                    {item.clientNom}
                  </TableCell>

                  <TableCell className="text-sm text-slate-600">
                    {item.artisanNom || "Non assigné"}
                  </TableCell>

                  <TableCell className="text-sm text-slate-600">
                    {item.dateReservation}
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className={`inline-flex min-w-[90px] justify-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        statut === "EN_ATTENTE"
                          ? "bg-amber-50 text-amber-700"
                          : statut === "ACCEPTEE"
                          ? "bg-blue-50 text-blue-700"
                          : statut === "TERMINEE"
                          ? "bg-emerald-50 text-emerald-700"
                          : statut === "REFUSEE"
                          ? "bg-red-50 text-red-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {statut}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LatestReservationsAdmin;