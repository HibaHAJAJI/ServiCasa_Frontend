import { useEffect, useState } from "react";
import {
  FaEye,
  FaTools,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEuroSign,
  FaCheck,
} from "react-icons/fa";

import reservationService from "../services/reservationService";

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

const InterventionsArtisan = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [notification, setNotification] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getInterventions(page, size);
      setInterventions(Array.isArray(data) ? data : data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les interventions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, [page, size]);

  const openDetails = (intervention) => {
    setSelectedIntervention(intervention);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setSelectedIntervention(null);
    setIsModalOpen(false);
  };

  const handleTerminer = async (id) => {
    if (actionLoading) return;
    try {
      setActionLoading(id);
      await reservationService.terminerReservation(id);

      showNotification("Intervention terminée avec succès.", "success");

      setInterventions((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, statutReservation: "TERMINEE" } : i
        )
      );

      if (selectedIntervention?.id === id) {
        setSelectedIntervention((prev) =>
          prev ? { ...prev, statutReservation: "TERMINEE" } : null
        );
      }
    } catch (err) {
      console.error(err);
      showNotification("Impossible de terminer l'intervention. Veuillez réessayer.", "error");
    } finally {
      setActionLoading(null);
    }
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

  const getStatutLabel = (statut) => {
    switch (statut) {
      case "EN_COURS":
        return "En cours";
      case "ACCEPTEE":
        return "Acceptée";
      case "TERMINEE":
        return "Terminée";
      default:
        return statut;
    }
  };

  const getStatutClass = (statut) => {
    switch (statut) {
      case "EN_COURS":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "ACCEPTEE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "TERMINEE":
        return "bg-slate-50 text-slate-700 border-slate-200/60";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/60";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0B1F3A] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl max-w-lg mx-auto mt-10 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-4">
      {notification && (
        <div
          className={`p-4 rounded-xl text-sm font-medium transition-all shadow-sm border ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : notification.type === "info"
              ? "bg-slate-100 text-slate-800 border-slate-300"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      {interventions.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-xs">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <FaTools className="text-2xl text-slate-400" />
          </div>
          <h3 className="text-slate-800 font-semibold text-base mb-1">Aucune intervention</h3>
          <p className="text-slate-400 text-sm">
            Aucune intervention en cours, acceptée ou terminée pour le moment.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                <TableHead className="py-4 px-6 text-slate-400 uppercase text-xs font-semibold">Client</TableHead>
                <TableHead className="py-4 px-6 text-slate-400 uppercase text-xs font-semibold">Date d'intervention</TableHead>
                <TableHead className="py-4 px-6 text-slate-400 uppercase text-xs font-semibold">Adresse</TableHead>
                <TableHead className="py-4 px-6 text-slate-400 uppercase text-xs font-semibold">Prix</TableHead>
                <TableHead className="py-4 px-6 text-slate-400 uppercase text-xs font-semibold">Statut</TableHead>
                <TableHead className="py-4 px-6 text-right text-slate-400 uppercase text-xs font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interventions.map((intervention) => (
                <TableRow key={intervention.id} className="hover:bg-slate-50/50">
                  <TableCell className="py-4 px-6 font-semibold text-slate-800">
                    {intervention.clientPrenom ? `${intervention.clientPrenom} ${intervention.clientNom || ""}` : intervention.clientNom || "Client"}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-slate-600 text-xs">
                    {formatDate(intervention.dateIntervention || intervention.dateReservation)}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-slate-600 text-xs max-w-xs truncate">
                    {intervention.adressIntervention || "Non définie"}
                  </TableCell>
                  <TableCell className="py-4 px-6 font-medium text-slate-800">
                    {intervention.prixTotal ? `${intervention.prixTotal} DH` : "Non défini"}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className={`px-3 py-1 border rounded-full text-xs font-semibold tracking-wide inline-block ${getStatutClass(intervention.statutReservation)}`}>
                      {getStatutLabel(intervention.statutReservation)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetails(intervention)}
                      className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Précédent
          </Button>
          <span className="text-sm text-slate-600">
            Page {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Suivant
          </Button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedIntervention && (
          <DialogContent className="max-w-lg rounded-3xl p-6">
            <DialogHeader className="pb-4 border-b border-slate-100 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                  #{selectedIntervention.id}
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900">
                    Détails de l'intervention
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-400">
                    Informations complètes de l'intervention
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 my-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-500">
                  <FaUser size={14} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Nom du Client</span>
                  <strong className="text-slate-800 font-semibold">
                    {selectedIntervention.clientPrenom ? `${selectedIntervention.clientPrenom} ${selectedIntervention.clientNom || ""}` : selectedIntervention.clientNom || "Client"}
                  </strong>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-500">
                  <FaCalendarAlt size={14} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Date d'intervention / Réservation</span>
                  <strong className="text-slate-800 font-semibold">
                    {formatDate(selectedIntervention.dateIntervention || selectedIntervention.dateReservation)}
                  </strong>
                </div>
              </div>

              {selectedIntervention.adressIntervention && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-500">
                    <FaMapMarkerAlt size={14} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Adresse d'intervention</span>
                    <strong className="text-slate-800 font-semibold">{selectedIntervention.adressIntervention}</strong>
                  </div>
                </div>
              )}

              {selectedIntervention.descriptionProbleme && (
                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Problème signalé :
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedIntervention.descriptionProbleme}
                  </p>
                </div>
              )}

              {selectedIntervention.prixTotal && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-500">
                    <FaEuroSign size={14} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Prix total</span>
                    <strong className="text-slate-800 font-semibold">{selectedIntervention.prixTotal} DH</strong>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 sm:justify-end">
              {selectedIntervention.statutReservation === "TERMINEE" ? (
                <span className="px-4 py-1.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-full text-xs font-bold">
                  Terminée
                </span>
              ) : (selectedIntervention.statutReservation === "ACCEPTEE" || selectedIntervention.statutReservation === "EN_COURS") ? (
                <Button
                  onClick={() => handleTerminer(selectedIntervention.id)}
                  disabled={actionLoading === selectedIntervention.id}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-2"
                >
                  <FaCheck size={13} />
                  {actionLoading === selectedIntervention.id ? "Terminaison..." : "Terminer"}
                </Button>
              ) : (
                <span className="px-4 py-1.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-full text-xs font-bold">
                  {getStatutLabel(selectedIntervention.statutReservation)}
                </span>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default InterventionsArtisan;