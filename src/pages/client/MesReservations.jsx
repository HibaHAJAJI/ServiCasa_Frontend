import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import reservationService from "@/services/reservationService";
import paiementService from "@/services/paiementService";

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

const canCancel = (statut) => statut === "EN_ATTENTE" || statut === "ACCEPTEE";

const MesReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState(null);
  const [paiements, setPaiements] = useState({});
  const [modeByReservation, setModeByReservation] = useState({});
  const [paiementLoading, setPaiementLoading] = useState({});
  const [count, setCount] = useState(null);

  const loadPaiements = async (list) => {
    const results = await Promise.all(
      (list || []).map(async (r) => {
        try {
          const p = await paiementService.getByReservation(r.id);
          return [r.id, p];
        } catch {
          return [r.id, null];
        }
      })
    );
    setPaiements(Object.fromEntries(results));
  };

  const loadReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await reservationService.getMyReservations();
      const list = data.content || [];
      setReservations(list);
      await loadPaiements(list);
      try {
        const c = await paiementService.count();
        setCount(c);
      } catch {
        setCount(null);
      }
    } catch {
      setError("Impossible de charger vos réservations. Veuillez réessayer.");
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
          const list = data.content || [];
          setReservations(list);
          const results = await Promise.all(
            list.map(async (r) => {
              try {
                const p = await paiementService.getByReservation(r.id);
                return [r.id, p];
              } catch {
                return [r.id, null];
              }
            })
          );
          if (active) setPaiements(Object.fromEntries(results));
          try {
            if (active) {
              const c = await paiementService.count();
              setCount(c);
            }
          } catch {
            setCount(null);
          }
        }
      } catch {
        if (active) setError("Impossible de charger vos réservations. Veuillez réessayer.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchReservations();
    return () => {
      active = false;
    };
  }, []);

  const handleCancel = async (id) => {
    const confirmed = window.confirm("Confirmer l'annulation de cette réservation ?");
    if (!confirmed) return;
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

  const handlePayer = async (reservation) => {
    const mode = modeByReservation[reservation.id] || "CASH";
    if (reservation.prixTotal == null) {
      alert("Prix total introuvable pour cette réservation");
      return;
    }
    setPaiementLoading((prev) => ({ ...prev, [reservation.id]: true }));
    try {
      const created = await paiementService.create({
        reservationId: reservation.id,
        modePaiement: mode,
      });
      setPaiements((prev) => ({ ...prev, [reservation.id]: created }));
      const c = await paiementService.count();
      setCount(c);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || "Erreur lors du paiement";
      alert(msg);
    } finally {
      setPaiementLoading((prev) => ({ ...prev, [reservation.id]: false }));
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Mes réservations</h1>
        <p className="mt-1 text-sm text-slate-500">Retrouvez ici toutes vos demandes d'intervention.</p>
        {count !== null && <p className="mt-1 text-xs text-slate-400">Total paiements : {count}</p>}
      </div>

      {loading && (
        <Card>
          <CardContent className="p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0B1F3A]" />
            <p className="mt-3 text-sm text-slate-500">Chargement...</p>
          </CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-red-500">{error}</p>
            <button type="button" onClick={loadReservations} className="mt-4 rounded-xl bg-[#0B1F3A] px-4 py-2 text-sm text-white hover:bg-[#132d52]">
              Réessayer
            </button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && reservations.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-slate-500">Vous n'avez aucune réservation pour le moment.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="space-y-4">
          {reservations.map((reservation) => {
            const paiement = paiements[reservation.id];
            const isLoading = paiementLoading[reservation.id];
            const selectedMode = modeByReservation[reservation.id] || paiement?.modePaiement || "CASH";

            return (
              <Card key={reservation.id} className="border-gray-200 bg-white shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-[#0B1F3A]">
                          {reservation.artisanPrenom ? `${reservation.artisanPrenom} ${reservation.artisanNom || ""}` : `Artisan #${reservation.artisanId}`}
                        </h3>
                        {reservation.artisanSpecialite && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{reservation.artisanSpecialite}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-slate-600 sm:grid-cols-2">
                        {reservation.dateReservation && (
                          <p>
                            <span className="mr-1 text-xs font-semibold uppercase text-slate-400">Date de réservation :</span>
                            {new Date(reservation.dateReservation).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                        {reservation.dateIntervention && (
                          <p>
                            <span className="mr-1 text-xs font-semibold uppercase text-slate-400">Date d'intervention :</span>
                            {new Date(reservation.dateIntervention).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                        {reservation.adressIntervention && (
                          <p>
                            <span className="mr-1 text-xs font-semibold uppercase text-slate-400">Adresse :</span>
                            {reservation.adressIntervention}
                          </p>
                        )}
                        {reservation.prixTotal != null && (
                          <p>
                            <span className="mr-1 text-xs font-semibold uppercase text-slate-400">Prix :</span>
                            {reservation.prixTotal} DH
                          </p>
                        )}
                        {reservation.descriptionProbleme && (
                          <p className="sm:col-span-2">
                            <span className="mr-1 text-xs font-semibold uppercase text-slate-400">Description :</span>
                            {reservation.descriptionProbleme}
                          </p>
                        )}

                        <div className="sm:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Paiement (simulation)</p>

                          {!paiement && (
                            <div className="space-y-2">
                              <p className="text-sm">
                                Montant : <span className="font-bold text-[#0B1F3A]">{reservation.prixTotal ?? "—"} DH</span>
                                <span className="ml-2 text-xs text-slate-400">(vient de la réservation)</span>
                              </p>
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <select
                                  value={selectedMode}
                                  onChange={(e) => setModeByReservation((prev) => ({ ...prev, [reservation.id]: e.target.value }))}
                                  className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                                >
                                  <option value="CASH">CASH</option>
                                  <option value="CARTE">CARTE</option>
                                  <option value="VIREMENT">VIREMENT</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handlePayer(reservation)}
                                  disabled={isLoading || reservation.prixTotal == null}
                                  className="rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#132d52] disabled:opacity-50"
                                >
                                  {isLoading ? "Traitement..." : "Payer"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => navigate(`/paiement/${reservation.id}`)}
                                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-white"
                                >
                                  Détails
                                </button>
                              </div>
                            </div>
                          )}

                          {paiement && paiement.statutPaiement === "PAYE" && (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-green-700">Paiement effectué</p>
                              <p className="text-sm">{paiement.modePaiement} · {paiement.montant} DH · {paiement.statutPaiement}</p>
                              {paiement.datePaiement && <p className="text-xs text-slate-500">Payé le {new Date(paiement.datePaiement).toLocaleString("fr-FR")}</p>}
                            </div>
                          )}

                          {paiement && paiement.statutPaiement === "ECHOUE" && (
                            <p className="text-sm text-red-600">Paiement échoué · {paiement.montant} DH</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statutColor[reservation.statutReservation] || "bg-slate-100 text-slate-500"}`}>
                        {statutLabel[reservation.statutReservation] || reservation.statutReservation}
                      </span>
                      {canCancel(reservation.statutReservation) && (
                        <button type="button" onClick={() => handleCancel(reservation.id)} disabled={canceling === reservation.id} className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50">
                          {canceling === reservation.id ? "Annulation..." : "Annuler"}
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MesReservations;
