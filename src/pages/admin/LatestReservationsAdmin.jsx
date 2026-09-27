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

const LATEST_LIMIT = 5;

const fullName = (prenom, nom) => [prenom, nom].filter(Boolean).join(" ").trim();

const toTime = (value) => {
  const time = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(time) ? -Infinity : time;
};

const byMostRecent = (a, b) => {
  const diff = toTime(b?.dateReservation) - toTime(a?.dateReservation);
  return Number.isNaN(diff) ? 0 : diff;
};

const formatDate = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LatestReservationsAdmin = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
      
        const data = await reservationService.getLatestReservations(0, LATEST_LIMIT);
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.content ?? [];
        setReservations([...list].sort(byMostRecent));
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error("Erreur chargement des dernières réservations :", err);
        setReservations([]);
        setError(
          err?.response?.status === 403
            ? "Accès refusé : droits insuffisants pour consulter les réservations."
            : "Impossible de charger les dernières réservations."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setReloadToken((token) => token + 1);
  };

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
          {error ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-2 text-xs text-red-600 hover:underline"
                >
                  Réessayer
                </button>
              </TableCell>
            </TableRow>
          ) : reservations.length === 0 ? (
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
              const client = fullName(item.clientPrenom, item.clientNom) || "—";
              const artisan = fullName(item.artisanPrenom, item.artisanNom) || "Non assigné";

              return (
                <TableRow
                  key={item.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <TableCell className="font-medium text-[#0B1F3A]">
                    {client}
                  </TableCell>

                  <TableCell className="text-sm text-slate-600">
                    {artisan}
                  </TableCell>

                  <TableCell className="text-sm text-slate-600">
                    {formatDate(item.dateReservation)}
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
                      {statut || "—"}
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
