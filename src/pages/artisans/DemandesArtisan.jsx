import { useEffect, useState } from "react";

import {
  FaClipboardList,
  FaEye,
  FaCheck,
  FaTimes,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import reservationService from "../../services/reservationService";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const DemandesArtisan = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const [selectedDemande, setSelectedDemande] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    let cancelled = false;

    const loadDemandes = async () => {
      try {
        setLoading(true);

        const data = await reservationService.getPendingReservations();

        if (cancelled) return;

        setDemandes(
          Array.isArray(data)
            ? data
            : data?.content || []
        );

        setError("");
      } catch (err) {
        if (cancelled) return;

        console.error(err);
        setError("Impossible de charger les demandes.");
        setDemandes([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDemandes();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAccepter = async (id) => {
    if (actionLoading) return;

    const demandeToRemove = demandes.find(d => d.id === id);

    try {
      setActionLoading(id);

      await reservationService.accepterReservation(id);

      showNotification(
        "Demande acceptée avec succès.",
        "success"
      );

      setDemandes((prev) =>
        prev.filter((d) => d.id !== id)
      );

      if (selectedDemande?.id === id) {
        setSelectedDemande((prev) =>
          prev
            ? {
                ...prev,
                statutReservation: "ACCEPTEE",
              }
            : null
        );
      }
    } catch (err) {
      console.error(err);

      showNotification(
        err?.response?.data?.message ||
          "Impossible de modifier la réservation. Veuillez réessayer.",
        "error"
      );
      if (demandeToRemove) {
        setDemandes(prev => [demandeToRemove, ...prev.filter(d => d.id !== id)]);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefuser = async (id) => {
    if (actionLoading) return;

    const demandeToRemove = demandes.find(d => d.id === id);

    try {
      setActionLoading(id);

      await reservationService.refuserReservation(id);

      showNotification(
        "Demande refusée.",
        "info"
      );

      setDemandes((prev) =>
        prev.filter((d) => d.id !== id)
      );

      if (selectedDemande?.id === id) {
        setSelectedDemande((prev) =>
          prev
            ? {
                ...prev,
                statutReservation: "REFUSEE",
              }
            : null
        );
      }
    } catch (err) {
      console.error(err);

      showNotification(
        err?.response?.data?.message ||
          "Impossible de modifier la réservation. Veuillez réessayer.",
        "error"
      );
      if (demandeToRemove) {
        setDemandes(prev => [demandeToRemove, ...prev.filter(d => d.id !== id)]);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const openDetails = (demande) => {
    setSelectedDemande(demande);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Non disponible";

    try {
      return new Date(dateStr).toLocaleString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0B1F3A]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center font-medium text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-6 md:p-8">
      {notification && (
        <div
          className={`rounded-xl border p-4 text-sm font-medium shadow-sm ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : notification.type === "info"
                ? "border-slate-300 bg-slate-100 text-slate-800"
                : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      {demandes.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
            <FaClipboardList className="text-2xl text-slate-400" />
          </div>

          <h3 className="mb-1 text-base font-semibold text-slate-800">
            Aucune demande
          </h3>

          <p className="text-sm text-slate-400">
            Aucune nouvelle demande de réservation pour le moment.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70">
                <TableHead className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                  Client
                </TableHead>

                <TableHead className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                  Date prévue
                </TableHead>

                <TableHead className="px-6 py-4 text-xs font-semibold uppercase text-slate-400">
                  Statut
                </TableHead>

                <TableHead className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {demandes.map((demande) => (
                <TableRow
                  key={demande.id}
                  className="hover:bg-slate-50/50"
                >
                  <TableCell className="px-6 py-4 font-semibold text-slate-800">
                    {demande.clientPrenom
                      ? `${demande.clientPrenom} ${
                          demande.clientNom || ""
                        }`
                      : demande.clientNom || "Client"}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-xs text-slate-600">
                    {formatDate(
                      demande.dateIntervention ||
                        demande.dateReservation
                    )}
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span className="inline-block rounded-full border border-amber-200/60 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      En attente
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetails(demande)}
                      className="h-8 cursor-pointer gap-1.5 text-xs font-medium"
                    >
                      <FaEye size={12} />
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);

          if (!open) {
            setSelectedDemande(null);
          }
        }}
      >
        {selectedDemande && (
          <DialogContent className="max-w-lg rounded-3xl p-6">
            <DialogHeader className="mb-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                  #{selectedDemande.id}
                </div>

                <div>
                  <DialogTitle className="text-base font-bold text-slate-900">
                    Détails de la demande
                  </DialogTitle>

                  <DialogDescription className="text-xs text-slate-400">
                    Informations complètes de la réservation
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="my-2 space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                  <FaUser size={14} />
                </div>

                <div>
                  <span className="block text-xs text-slate-400">
                    Nom du Client
                  </span>

                  <strong className="font-semibold text-slate-800">
                    {selectedDemande.clientPrenom
                      ? `${selectedDemande.clientPrenom} ${
                          selectedDemande.clientNom || ""
                        }`
                      : selectedDemande.clientNom || "Client"}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                  <FaCalendarAlt size={14} />
                </div>

                <div>
                  <span className="block text-xs text-slate-400">
                    Date d'intervention / Réservation
                  </span>

                  <strong className="font-semibold text-slate-800">
                    {formatDate(
                      selectedDemande.dateIntervention ||
                        selectedDemande.dateReservation
                    )}
                  </strong>
                </div>
              </div>

              {selectedDemande.adressIntervention && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                    <FaMapMarkerAlt size={14} />
                  </div>

                  <div>
                    <span className="block text-xs text-slate-400">
                      Adresse d'intervention
                    </span>

                    <strong className="font-semibold text-slate-800">
                      {selectedDemande.adressIntervention}
                    </strong>
                  </div>
                </div>
              )}

              {selectedDemande.descriptionProbleme && (
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-800">
                    Problème signalé :
                  </span>

                  <p className="text-sm leading-relaxed text-slate-700">
                    {selectedDemande.descriptionProbleme}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
              {selectedDemande.statutReservation === "ACCEPTEE" ? (
                <span className="rounded-full border border-emerald-200 bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800">
                  Acceptée
                </span>
              ) : selectedDemande.statutReservation === "REFUSEE" ? (
                <span className="rounded-full border border-red-200 bg-red-100 px-4 py-1.5 text-xs font-bold text-red-800">
                  Refusée
                </span>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleRefuser(selectedDemande.id)
                    }
                    disabled={
                      actionLoading === selectedDemande.id
                    }
                    className="cursor-pointer gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <FaTimes size={13} />

                    {actionLoading === selectedDemande.id
                      ? "Traitement..."
                      : "Refuser"}
                  </Button>

                  <Button
                    onClick={() =>
                      handleAccepter(selectedDemande.id)
                    }
                    disabled={
                      actionLoading === selectedDemande.id
                    }
                    className="cursor-pointer gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <FaCheck size={13} />

                    {actionLoading === selectedDemande.id
                      ? "Traitement..."
                      : "Accepter"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DemandesArtisan;