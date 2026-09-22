import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Briefcase, Calendar, MapPin } from "lucide-react";

import artisanService from "@/services/artisanService";
import reservationService from "@/services/reservationService";
import { useAuth } from "@/context/auth/AuthContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ArtisanProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateIntervention, setDateIntervention] = useState("");
  const [adressIntervention, setAdressIntervention] = useState("");
  const [descriptionProbleme, setDescriptionProbleme] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await artisanService.getById(id);
        setArtisan(data);
      } catch (error) {
        console.error(error);
        setError("Impossible de charger le profil de l'artisan.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtisan();
  }, [id]);

  const handleOpenReservation = () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/artisans/${id}`,
        },
      });
      return;
    }

    setSubmitError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    if (
      !dateIntervention ||
      !adressIntervention ||
      !descriptionProbleme
    ) {
      setSubmitError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setSubmitting(true);

      await reservationService.createReservation({
        artisanId: Number(id),
        dateIntervention: `${dateIntervention}T09:00:00`,
        adressIntervention,
        descriptionProbleme,
      });

      setSuccessMessage(
        "Votre demande de réservation a été envoyée avec succès."
      );

      setDateIntervention("");
      setAdressIntervention("");
      setDescriptionProbleme("");

      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/client/reservations");
      }, 1200);
    } catch (error) {
      console.error(error);

      setSubmitError(
        "Impossible de créer la réservation. Veuillez réessayer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0B1F3A] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 text-center text-red-500 bg-red-50 rounded-2xl border border-red-200">
        {error || "Artisan introuvable."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6 md:p-8">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 pb-6 border-b border-slate-100">

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center font-bold text-xl">
                {artisan.prenom?.charAt(0)}
                {artisan.nom?.charAt(0)}
              </div>

              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#0B1F3A]">
                  {artisan.prenom} {artisan.nom}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Briefcase size={15} />
                    {artisan.specialite || "Spécialité non renseignée"}
                  </span>

                  {artisan.ville && (
                    <>
                      <span>•</span>

                      <span className="flex items-center gap-1">
                        <MapPin size={15} />
                        {artisan.ville}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={handleOpenReservation}
              className="bg-[#0B1F3A] hover:bg-[#132d52] text-white rounded-xl"
            >
              <Calendar size={16} className="mr-2" />
              Réserver
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 uppercase font-semibold">
                Spécialité
              </p>

              <p className="mt-1 font-semibold text-[#0B1F3A]">
                {artisan.specialite || "Non renseignée"}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 uppercase font-semibold">
                Tarif horaire
              </p>

              <p className="mt-1 font-semibold text-[#0B1F3A]">
                {artisan.tarifHoraire != null
                  ? `${artisan.tarifHoraire} DH/h`
                  : "Non renseigné"}
              </p>
            </div>

          </div>

          {artisan.ville && (
            <div className="mt-6">
              <h2 className="font-semibold text-[#0B1F3A] mb-2">
                Ville
              </h2>

              <p className="text-sm text-slate-600">
                {artisan.ville}
              </p>
            </div>
          )}

        </CardContent>
      </Card>

      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#0B1F3A]">
              Réserver {artisan.prenom} {artisan.nom}
            </DialogTitle>

            <DialogDescription>
              Remplissez les informations de votre intervention.
            </DialogDescription>
          </DialogHeader>

          {successMessage ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 text-sm text-center">
              {successMessage}
            </div>
          ) : (
            <form
              onSubmit={handleBookingSubmit}
              className="space-y-4"
            >
              {submitError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Date d'intervention
                </label>

                <input
                  type="date"
                  required
                  value={dateIntervention}
                  onChange={(e) =>
                    setDateIntervention(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Adresse d'intervention
                </label>

                <input
                  type="text"
                  required
                  placeholder="Adresse de l'intervention"
                  value={adressIntervention}
                  onChange={(e) =>
                    setAdressIntervention(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description du problème
                </label>

                <textarea
                  required
                  rows={4}
                  placeholder="Décrivez le problème..."
                  value={descriptionProbleme}
                  onChange={(e) =>
                    setDescriptionProbleme(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </Button>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0B1F3A] hover:bg-[#132d52] text-white"
                >
                  {submitting
                    ? "Envoi..."
                    : "Confirmer la réservation"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtisanProfile;