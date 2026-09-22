import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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

const canCancel = (statut) =>
  statut === "EN_ATTENTE" || statut === "ACCEPTEE";

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState(null);

  const loadReservations = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await reservationService.getMyReservations();
              setReservations(data.content || []);
    } catch {
      setError(
        "Impossible de charger vos réservations. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchReservations = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await reservationService.getMyReservations();

        if (active) {
          setReservations(data.content || []);
        }
      } catch {
        if (active) {
          setError(
            "Impossible de charger vos réservations. Veuillez réessayer."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchReservations();

    return () => {
      active = false;
    };
  }, []);

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Confirmer l'annulation de cette réservation ?"
    );

    if (!confirmed) {
      return;
    }

    setCanceling(id);

    try {
      await reservationService.cancelReservation(id);
      await loadReservations();
    } catch {
      alert("Impossible d'annuler cette réservation.");
    } finally {
      setCanceling(null);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">
          Mes réservations
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Retrouvez ici toutes vos demandes d'intervention.
        </p>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0B1F3A]" />

            <p className="mt-3 text-sm text-slate-500">
              Chargement...
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-red-500">
              {error}
            </p>

            <button
              type="button"
              onClick={loadReservations}
              className="mt-4 rounded-xl bg-[#0B1F3A] px-4 py-2 text-sm text-white hover:bg-[#132d52]"
            >
              Réessayer
            </button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && reservations.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-slate-500">
              Vous n'avez aucune réservation pour le moment.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card
              key={reservation.id}
              className="border-gray-200 bg-white shadow-sm"
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-[#0B1F3A]">
                        {reservation.artisanPrenom
                          ? `${reservation.artisanPrenom} ${
                              reservation.artisanNom || ""
                            }`
                          : `Artisan #${reservation.artisanId}`}
                      </h3>

                      {reservation.artisanSpecialite && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          {reservation.artisanSpecialite}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-slate-600 sm:grid-cols-2">
                      {reservation.dateIntervention && (
                        <p>
                          <span className="mr-1 text-xs font-semibold uppercase text-slate-400">
                            Date :
                          </span>

                          {new Date(
                            reservation.dateIntervention
                          ).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}

                      {reservation.adressIntervention && (
                        <p>
                          <span className="mr-1 text-xs font-semibold uppercase text-slate-400">
                            Adresse :
                          </span>

                          {reservation.adressIntervention}
                        </p>
                      )}

                      {reservation.prixTotal != null && (
                        <p>
                          <span className="mr-1 text-xs font-semibold uppercase text-slate-400">
                            Prix :
                          </span>

                          {reservation.prixTotal} DH
                        </p>
                      )}

                      {reservation.descriptionProbleme && (
                        <p className="sm:col-span-2">
                          <span className="mr-1 text-xs font-semibold uppercase text-slate-400">
                            Description :
                          </span>

                          {reservation.descriptionProbleme}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statutColor[reservation.statutReservation] ||
                        "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {statutLabel[reservation.statutReservation] ||
                        reservation.statutReservation}
                    </span>

                    {canCancel(reservation.statutReservation) && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCancel(reservation.id)
                        }
                        disabled={canceling === reservation.id}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        {canceling === reservation.id
                          ? "Annulation..."
                          : "Annuler"}
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesReservations;