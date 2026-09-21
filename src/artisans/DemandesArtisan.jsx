import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaEye,
  FaCheck,
  FaTimes,
  FaUser,
  FaCalendarAlt,
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

const DemandesArtisan = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        setLoading(true);
        const data = await reservationService.getPendingReservations();
        setDemandes(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les demandes.");
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  const handleAccepter = async (id) => {
    try {
      setActionLoading(id);
      await reservationService.updateReservationStatus(id, "ACCEPTEE");
      setDemandes(demandes.filter((d) => d.id !== id));
      if (selectedDemande?.id === id) closeDetails();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'acceptation.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefuser = async (id) => {
    try {
      setActionLoading(id);
      await reservationService.updateReservationStatus(id, "REFUSEE");
      setDemandes(demandes.filter((d) => d.id !== id));
      if (selectedDemande?.id === id) closeDetails();
    } catch (err) {
      console.error(err);
      alert("Erreur lors du refus.");
    } finally {
      setActionLoading(null);
    }
  };

  const openDetails = (demande) => {
    setSelectedDemande(demande);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setSelectedDemande(null);
    setIsModalOpen(false);
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
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      {demandes.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-xs">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <FaClipboardList className="text-2xl text-slate-400" />
          </div>
          <h3 className="text-slate-800 font-semibold text-base mb-1">Aucune demande</h3>
          <p className="text-slate-400 text-sm">
            Aucune nouvelle demande de réservation pour le moment.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                <TableHead className="py-4 px-6 text-slate-400 uppercase text-xs font-semibold">Client</TableHead>
                <TableHead className="py-4 px-6 text-slate-400 uppercase text-xs font-semibold">Date prévue</TableHead>
                <TableHead className="py-4 px-6 text-slate-400 uppercase text-xs font-semibold">Statut</TableHead>
                <TableHead className="py-4 px-6 text-right text-slate-400 uppercase text-xs font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demandes.map((demande) => (
                <TableRow key={demande.id} className="hover:bg-slate-50/50">
                  <TableCell className="py-4 px-6 font-semibold text-slate-800">
                    {demande.clientPrenom ? `${demande.clientPrenom} ${demande.clientNom || ""}` : demande.clientNom || "Client"}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-slate-600">
                    {demande.dateReservation || "Non disponible"}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full text-xs font-semibold tracking-wide inline-block">
                      En attente
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetails(demande)}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedDemande && (
          <DialogContent className="max-w-lg rounded-3xl p-6">
            <DialogHeader className="pb-4 border-b border-slate-100 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
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

            <div className="space-y-4 my-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-500">
                  <FaUser size={14} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Nom du Client</span>
                  <strong className="text-slate-800 font-semibold">
                    {selectedDemande.clientPrenom ? `${selectedDemande.clientPrenom} ${selectedDemande.clientNom || ""}` : selectedDemande.clientNom || "Client"}
                  </strong>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-500">
                  <FaCalendarAlt size={14} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Date d'intervention / Réservation</span>
                  <strong className="text-slate-800 font-semibold">{selectedDemande.dateReservation || "Non disponible"}</strong>
                </div>
              </div>

              {selectedDemande.descriptionProbleme && (
                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Problème signalé :
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedDemande.descriptionProbleme}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => handleRefuser(selectedDemande.id)}
                disabled={actionLoading === selectedDemande.id}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer gap-2"
              >
                <FaTimes size={13} />
                Refuser
              </Button>
              <Button
                onClick={() => handleAccepter(selectedDemande.id)}
                disabled={actionLoading === selectedDemande.id}
                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-2"
              >
                <FaCheck size={13} />
                {actionLoading === selectedDemande.id ? "Traitement..." : "Accepter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DemandesArtisan;