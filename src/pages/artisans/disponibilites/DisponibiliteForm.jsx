import { useState } from "react";
import { Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const jours = [
  { value: "MONDAY", label: "Lundi" },
  { value: "TUESDAY", label: "Mardi" },
  { value: "WEDNESDAY", label: "Mercredi" },
  { value: "THURSDAY", label: "Jeudi" },
  { value: "FRIDAY", label: "Vendredi" },
  { value: "SATURDAY", label: "Samedi" },
  { value: "SUNDAY", label: "Dimanche" },
];

const DisponibiliteForm = ({
  disponibilite,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    jour: disponibilite?.jour || "",
    heureDebut: disponibilite?.heureDebut || "",
    heureFin: disponibilite?.heureFin || "",
    disponible: disponibilite?.disponible ?? true,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.jour) {
      return;
    }

    if (
      formData.disponible &&
      (!formData.heureDebut || !formData.heureFin)
    ) {
      return;
    }

    if (
      formData.disponible &&
      formData.heureDebut >= formData.heureFin
    ) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <Label htmlFor="jour">Jour</Label>

          <select
            id="jour"
            name="jour"
            value={formData.jour || ""}
            onChange={handleChange}
            required
            disabled={loading}
            className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10 disabled:bg-slate-50"
          >
            <option value="">Choisir un jour</option>

            {jours.map((jour) => (
              <option key={jour.value} value={jour.value}>
                {jour.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="heureDebut">Heure début</Label>

          <div className="relative mt-2">
            <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="heureDebut"
              type="time"
              name="heureDebut"
              value={formData.heureDebut || ""}
              onChange={handleChange}
              required={formData.disponible}
              disabled={!formData.disponible || loading}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="heureFin">Heure fin</Label>

          <div className="relative mt-2">
            <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="heureFin"
              type="time"
              name="heureFin"
              value={formData.heureFin || ""}
              onChange={handleChange}
              required={formData.disponible}
              disabled={!formData.disponible || loading}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]/10 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-4">
        <input
          type="checkbox"
          name="disponible"
          checked={Boolean(formData.disponible)}
          onChange={handleChange}
          disabled={loading}
          className="h-4 w-4 accent-[#0B1F3A]"
        />

        <div>
          <p className="text-sm font-medium text-[#0B1F3A]">
            Disponible ce jour
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Décochez pour définir ce jour comme jour de repos.
          </p>
        </div>
      </label>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-[#0B1F3A] hover:bg-[#132d52]"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default DisponibiliteForm;