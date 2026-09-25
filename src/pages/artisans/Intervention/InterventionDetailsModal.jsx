import { useEffect, useState } from "react";
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaEuroSign, FaCheck } from "react-icons/fa";
import paiementService from "../../../services/paiementService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const InterventionDetailsModal = ({
  isOpen,
  onOpenChange,
  intervention,
  onTerminer,
  actionLoading,
}) => {
  const [paiement, setPaiement] = useState(null);
  const [loadingPaiement, setLoadingPaiement] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPaiement = async () => {
      if (intervention && intervention.statutReservation === "TERMINEE") {
        setLoadingPaiement(true);
        try {
          const p = await paiementService.getByReservation(intervention.id);
          if (isMounted) setPaiement(p);
        } catch {
          if (isMounted) setPaiement(null);
        } finally {
          if (isMounted) setLoadingPaiement(false);
        }
      } else {
        setPaiement(null);
      }
    };

    if (isOpen) {
      fetchPaiement();
    }

    return () => {
      isMounted = false;
    };
  }, [intervention, isOpen]);

  if (!intervention) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6">
        <DialogHeader className="pb-4 border-b border-slate-100 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
              #{intervention.id}
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
                {intervention.clientPrenom
                  ? `${intervention.clientPrenom} ${intervention.clientNom || ""}`
                  : intervention.clientNom || "Client"}
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
                {formatDate(intervention.dateIntervention || intervention.dateReservation)}
              </strong>
            </div>
          </div>

          {intervention.adressIntervention && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-500">
                <FaMapMarkerAlt size={14} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Adresse d'intervention</span>
                <strong className="text-slate-800 font-semibold">{intervention.adressIntervention}</strong>
              </div>
            </div>
          )}

          {intervention.descriptionProbleme && (
            <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                Problème signalé :
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {intervention.descriptionProbleme}
              </p>
            </div>
          )}

          {intervention.prixTotal && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-500">
                <FaEuroSign size={14} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Prix total</span>
                <strong className="text-slate-800 font-semibold">{intervention.prixTotal} DH</strong>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 sm:justify-end">
          {intervention.statutReservation === "TERMINEE" ? (
            loadingPaiement ? (
              <span className="text-xs text-slate-400">Chargement du paiement...</span>
            ) : paiement?.statutPaiement === "PAYE" ? (
              <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                Paiement confirmé · {paiement?.modePaiement} · {paiement?.montant} DH
              </span>
            ) : paiement ? (
              <span className="px-4 py-1.5 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full text-xs font-bold">
                {paiement?.statutPaiement} · {paiement?.montant} DH
              </span>
            ) : (
              <span className="px-4 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs">
                Aucun paiement (le client paie depuis son espace)
              </span>
            )
          ) : intervention.statutReservation === "ACCEPTEE" ||
            intervention.statutReservation === "EN_COURS" ? (
            <Button
              onClick={() => onTerminer(intervention.id)}
              disabled={actionLoading === intervention.id}
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-2"
            >
              <FaCheck size={13} />
              {actionLoading === intervention.id ? "Terminaison..." : "Terminer"}
            </Button>
          ) : (
            <span className="px-4 py-1.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-full text-xs font-bold">
              {getStatutLabel(intervention.statutReservation)}
            </span>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default InterventionDetailsModal;