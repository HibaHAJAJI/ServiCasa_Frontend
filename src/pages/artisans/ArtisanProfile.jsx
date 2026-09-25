import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Banknote,
  Briefcase,
  Clock,
  MapPin,
  Phone,
  Star,
  Calendar,
} from "lucide-react";

import artisanService from "@/services/artisanService";
import avisService from "@/services/avisService";
import disponibiliteService from "@/services/disponibiliteService";
import reservationService from "@/services/reservationService";
import { useAuth } from "@/context/auth/AuthContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReservationCard from "./servicesArtisan/ReservationCard";

const ArtisanProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [moyenneAvis, setMoyenneAvis] = useState(0);
  const [nombreAvis, setNombreAvis] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateIntervention, setDateIntervention] = useState("");
  const [heureIntervention, setHeureIntervention] = useState("");
  const [adressIntervention, setAdressIntervention] = useState("");
  const [descriptionProbleme, setDescriptionProbleme] = useState("");

  const [disponibilites, setDisponibilites] = useState([]);
  const [selectedHeure, setSelectedHeure] = useState("");
  const [loadingDisp, setLoadingDisp] = useState(false);
  const [filteredSlots, setFilteredSlots] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const hasValue = (value) => {
    return (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    );
  };

  const hasReviews = Number(nombreAvis) > 0;

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await artisanService.getById(id);

        setArtisan(data);

        if (
          data.moyenneAvis === undefined ||
          data.moyenneAvis === null ||
          data.nombreAvis === undefined ||
          data.nombreAvis === null
        ) {
          const [moyenne, count] = await Promise.all([
            avisService.getMoyenneArtisan(data.id),
            avisService.getNombreAvisArtisan(data.id),
          ]);

          setMoyenneAvis(Number(moyenne) || 0);
          setNombreAvis(Number(count) || 0);
        } else {
          setMoyenneAvis(Number(data.moyenneAvis) || 0);
          setNombreAvis(Number(data.nombreAvis) || 0);
        }
      } catch (error) {
        console.error(error);
        setError("Impossible de charger le profil de l'artisan.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtisan();
  }, [id]);

  const loadDisponibilites = async (artisanId) => {
    try {
      setLoadingDisp(true);

      const response = await disponibiliteService.getByArtisan(artisanId);

      const data = Array.isArray(response)
        ? response
        : response?.content || response?.data || [];

      setDisponibilites(data);
    } catch (error) {
      console.error("Erreur chargement disponibilités :", error);
      setDisponibilites([]);
    } finally {
      setLoadingDisp(false);
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;

    setDateIntervention(date);
    setSelectedHeure("");
    setHeureIntervention("");
    setFilteredSlots([]);

    if (!date || !artisan?.id) {
      return;
    }

    try {
      setLoadingDisp(true);

      const response =
        await disponibiliteService.getByArtisanAndDate(
          artisan.id,
          date
        );

      const data = Array.isArray(response)
        ? response
        : response?.content || response?.data || [];

      const slots = data.filter((slot) => slot.disponible);
      const fallbackSlots = disponibilites.filter(
        (slot) =>
          slot.disponible &&
          String(slot.date).slice(0, 10) === date
      );

      setFilteredSlots(slots.length > 0 ? slots : fallbackSlots);
    } catch (error) {
      console.error("Erreur chargement disponibilités :", error);
      setFilteredSlots([]);
    } finally {
      setLoadingDisp(false);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedHeure(slot.heureDebut);
    setHeureIntervention(slot.heureDebut);
  };

  const handleOpenReservation = async () => {
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

    if (artisan?.id) {
      await loadDisponibilites(artisan.id);
    }

    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setSuccessMessage("");

    if (
      !dateIntervention ||
      !selectedHeure ||
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
        dateIntervention: `${dateIntervention}T${selectedHeure}:00`,
        adressIntervention,
        descriptionProbleme,
        prixTotal: artisan.tarifHoraire ?? 250,
      });

      setSuccessMessage(
        "Votre demande de réservation a été envoyée avec succès."
      );

      setDateIntervention("");
      setSelectedHeure("");
      setHeureIntervention("");
      setAdressIntervention("");
      setDescriptionProbleme("");
      setFilteredSlots([]);

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
                  {hasValue(artisan.specialite) && (
                    <span className="flex items-center gap-1">
                      <Briefcase size={15} />
                      {artisan.specialite}
                    </span>
                  )}

                  {hasValue(artisan.ville) && (
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

          {(hasValue(artisan.specialite) ||
            hasValue(artisan.tarifHoraire) ||
            hasValue(artisan.anneesExperience) ||
            hasValue(artisan.zoneIntervention)) && (
            <section className="mt-6">
              <h2 className="font-semibold text-[#0B1F3A] mb-3">
                Informations professionnelles
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hasValue(artisan.specialite) && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-semibold">
                      <Briefcase size={15} />
                      Spécialité
                    </div>

                    <p className="mt-1 font-semibold text-[#0B1F3A]">
                      {artisan.specialite}
                    </p>
                  </div>
                )}

                {hasValue(artisan.tarifHoraire) && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-semibold">
                      <Banknote size={15} />
                      Tarif horaire
                    </div>

                    <p className="mt-1 font-semibold text-[#0B1F3A]">
                      {artisan.tarifHoraire} DH/h
                    </p>
                  </div>
                )}

                {hasValue(artisan.anneesExperience) && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-semibold">
                      <Clock size={15} />
                      Expérience
                    </div>

                    <p className="mt-1 font-semibold text-[#0B1F3A]">
                      {artisan.anneesExperience}{" "}
                      {Number(artisan.anneesExperience) === 1
                        ? "an"
                        : "ans"}
                    </p>
                  </div>
                )}

                {hasValue(artisan.zoneIntervention) && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-semibold">
                      <MapPin size={15} />
                      Zone d'intervention
                    </div>

                    <p className="mt-1 font-semibold text-[#0B1F3A]">
                      {artisan.zoneIntervention}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {(hasValue(artisan.ville) ||
            hasValue(artisan.telephone)) && (
            <section className="mt-6">
              <h2 className="font-semibold text-[#0B1F3A] mb-3">
                Informations de contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hasValue(artisan.ville) && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-semibold">
                      <MapPin size={15} />
                      Ville
                    </div>

                    <p className="mt-1 font-semibold text-[#0B1F3A]">
                      {artisan.ville}
                    </p>
                  </div>
                )}

                {hasValue(artisan.telephone) && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-semibold">
                      <Phone size={15} />
                      Téléphone
                    </div>

                    <p className="mt-1 font-semibold text-[#0B1F3A]">
                      {artisan.telephone}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {hasValue(artisan.description) && (
            <section className="mt-6">
              <h2 className="font-semibold text-[#0B1F3A] mb-2">
                Présentation
              </h2>

              <p className="text-sm leading-6 text-slate-600">
                {artisan.description}
              </p>
            </section>
          )}

          <section className="mt-6">
            <h2 className="font-semibold text-[#0B1F3A] mb-3">
              Avis clients
            </h2>

            {hasReviews ? (
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= Math.round(moyenneAvis)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-[#0B1F3A] text-lg">
                    {Number(moyenneAvis).toFixed(1)}
                  </span>

                  <span className="text-sm text-slate-500">
                    {Number(nombreAvis)} avis
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Star
                  size={18}
                  className="text-yellow-400"
                />
                <span>Aucun avis</span>
              </div>
            )}
          </section>
        </CardContent>
      </Card>

      <ReservationCard
        artisan={artisan}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        dateIntervention={dateIntervention}
        setDateIntervention={setDateIntervention}
        heureIntervention={heureIntervention}
        setHeureIntervention={setHeureIntervention}
        adressIntervention={adressIntervention}
        setAdressIntervention={setAdressIntervention}
        descriptionProbleme={descriptionProbleme}
        setDescriptionProbleme={setDescriptionProbleme}
        loadingDisp={loadingDisp}
        filteredSlots={filteredSlots}
        selectedHeure={selectedHeure}
        handleDateChange={handleDateChange}
        handleSlotSelect={handleSlotSelect}
        handleBookingSubmit={handleBookingSubmit}
        submitting={submitting}
        submitError={submitError}
        successMessage={successMessage}
      />
    </div>
  );
};

export default ArtisanProfile;