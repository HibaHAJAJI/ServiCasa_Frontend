import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import avisService from "@/services/avisService";

const STARS = [1, 2, 3, 4, 5];

const extractErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (data && typeof data === "object") {
    const firstFieldMessage = Object.values(data).find(
      (value) => typeof value === "string" && value.trim()
    );
    if (firstFieldMessage) return firstFieldMessage;
  }
  return fallback;
};

const AvisForm = ({ open, onOpenChange, reservation, onSuccess }) => {
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setNote(0);
    setCommentaire("");
    setError("");
  };

  if (!reservation) return null;

  const artisanName = reservation.artisanPrenom
    ? `${reservation.artisanPrenom} ${reservation.artisanNom || ""}`.trim()
    : reservation.artisanNom || "Artisan";

  const handleOpenChange = (nextOpen) => {
    if (nextOpen || loading) return;
    reset();
    onOpenChange(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (note === 0) {
      setError("Veuillez choisir une note.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const avis = await avisService.createAvis({
        reservationId: reservation.id,
        note: note,
        commentaire: commentaire.trim() ? commentaire.trim() : null,
      });

      reset();
      onOpenChange(false);
      onSuccess?.(avis);
    } catch (err) {
      console.error(err);
      setError(
        extractErrorMessage(
          err,
          "Impossible d'envoyer l'avis. Veuillez réessayer."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6">
        <DialogHeader className="pb-4 border-b border-slate-100">
          <DialogTitle className="text-base font-bold text-[#0B1F3A]">
            Donner un avis
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Votre avis sera transmis à {artisanName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-[#0B1F3A]">
              Votre note <span className="text-red-500">*</span>
            </p>

            <div className="flex items-center gap-1">
              {STARS.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNote(star)}
                  disabled={loading}
                  aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
                  aria-pressed={star === note}
                  className="rounded p-0.5 transition-transform hover:scale-110 disabled:pointer-events-none"
                >
                  <Star
                    size={30}
                    className={
                      star <= note
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }
                  />
                </button>
              ))}

              {note > 0 && (
                <span className="ml-2 text-sm font-semibold text-[#0B1F3A]">
                  {note}/5
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-[#0B1F3A]">
              Commentaire (optionnel)
            </p>

            <Textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              disabled={loading}
              placeholder="Partagez votre expérience..."
              rows={4}
              maxLength={1000}
            />
          </div>

          <DialogFooter className="border-t border-slate-100 pt-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              disabled={loading || note === 0}
              className="bg-[#0B1F3A] text-white hover:bg-[#132d52]"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AvisForm;
