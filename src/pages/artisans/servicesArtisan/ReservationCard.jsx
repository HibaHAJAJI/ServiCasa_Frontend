import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ReservationCard = ({
  artisan,
  isModalOpen,
  setIsModalOpen,
  dateIntervention,
  adressIntervention,
  setAdressIntervention,
  descriptionProbleme,
  setDescriptionProbleme,
  loadingDisp,
  filteredSlots,
  selectedHeure,
  handleDateChange,
  handleSlotSelect,
  handleBookingSubmit,
  submitting,
  submitError,
  successMessage,
}) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F3A]">
            Réserver {artisan?.prenom} {artisan?.nom}
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
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {submitError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date d'intervention
                </label>

                <input
                  type="date"
                  required
                  value={dateIntervention}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
  <label className="block text-sm font-medium mb-1">
    Heure d'intervention
  </label>

  {loadingDisp && (
    <p className="text-xs text-slate-400 py-2">
      Chargement des créneaux...
    </p>
  )}

  {!loadingDisp &&
    filteredSlots.length === 0 &&
    dateIntervention && (
      <p className="text-xs text-red-500 py-2">
        Aucun créneau disponible pour cette date.
      </p>
    )}

  <div className="flex flex-wrap gap-2 mt-1">
    {filteredSlots.map((slot) => (
      <button
        key={slot.id || slot.heureDebut}
        type="button"
        onClick={() => handleSlotSelect(slot)}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition ${
          selectedHeure === slot.heureDebut
            ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
            : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
        }`}
      >
        {slot.heureDebut} - {slot.heureFin}
      </button>
    ))}
  </div>

  {selectedHeure && (
    <p className="text-xs text-slate-500 mt-1">
      Heure sélectionnée : {selectedHeure}
    </p>
  )}
</div>
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
                onChange={(e) => setAdressIntervention(e.target.value)}
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
                onChange={(e) => setDescriptionProbleme(e.target.value)}
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
                {submitting ? "Envoi..." : "Confirmer la réservation"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReservationCard;