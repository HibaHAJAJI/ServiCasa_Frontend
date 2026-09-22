import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import avisService from "@/services/avisService";

const AvisForm = ({ reservation, onClose, onSuccess }) => {
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (note === 0) {
      setError("Veuillez choisir une note.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await avisService.createAvis({
        reservationId: reservation.id,
        note: note,
        commentaire: commentaire,
      });

      if (onSuccess) {
        onSuccess(reservation.id);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(error);
      setError("Impossible d'envoyer l'avis. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const artisanName = reservation.artisanPrenom
    ? `${reservation.artisanPrenom} ${reservation.artisanNom || ""}`
    : "Artisan";

  return (
    <div className="w-full max-w-md">
      <h2 className="text-xl font-bold text-[#0B1F3A]">
        Donner un avis
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {artisanName}
      </p>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium">
          Votre note
        </p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setNote(star)}
              className={`text-3xl transition-colors ${
                star <= note
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
              aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium">
          Commentaire (optionnel)
        </p>

        <Textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Partagez votre expérience..."
          rows={4}
        />
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Annuler
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading || note === 0}
          className="bg-[#0B1F3A] hover:bg-[#132d52]"
        >
          {loading ? "Envoi..." : "Envoyer"}
        </Button>
      </div>
    </div>
  );
};

export default AvisForm;