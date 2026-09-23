import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ServiceArtisanForm = ({
  service,
  onSubmit,
  onCancel,
  loading = false,
  categories = [],
}) => {
  const [formData, setFormData] = useState({
    nom: service?.nom || "",
    description: service?.description || "",
    tarif: service?.tarif ?? "",
    categorieId: service?.categorieId
      ? String(service.categorieId)
      : "",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nomTrimmed = (formData.nom || "").trim();

    if (!nomTrimmed) {
      setFormError("Le nom du service est obligatoire.");
      return;
    }

    const tarifNum = Number(formData.tarif);

    if (
      formData.tarif === "" ||
      Number.isNaN(tarifNum) ||
      tarifNum <= 0
    ) {
      setFormError(
        "Veuillez saisir un tarif valide supérieur à 0."
      );
      return;
    }

    const submitData = {
      nom: nomTrimmed,
      description: (formData.description || "").trim(),
      tarif: tarifNum,
      categorieId: formData.categorieId
        ? Number(formData.categorieId)
        : null,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {formError}
        </div>
      )}

      <div>
        <Label
          htmlFor="nom"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Nom du service{" "}
          <span className="text-red-500">*</span>
        </Label>

        <input
          id="nom"
          name="nom"
          type="text"
          value={formData.nom}
          onChange={handleChange}
          disabled={loading}
          required
          placeholder="Ex: Réparation plomberie, Peinture murale..."
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] disabled:bg-slate-50"
        />
      </div>

      <div>
        <Label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Description
        </Label>

        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
          rows={3}
          placeholder="Détaillez ce que comprend votre prestation..."
          className="w-full text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="tarif"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Tarif (DH){" "}
            <span className="text-red-500">*</span>
          </Label>

          <input
            id="tarif"
            name="tarif"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.tarif}
            onChange={handleChange}
            disabled={loading}
            required
            placeholder="Ex: 150"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] disabled:bg-slate-50"
          />
        </div>

        <div>
          <Label
            htmlFor="categorieId"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Catégorie
          </Label>

          <select
            id="categorieId"
            name="categorieId"
            value={formData.categorieId}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 transition focus:border-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] disabled:bg-slate-50"
          >
            <option value="">
              — Choisir une catégorie —
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          Annuler
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="bg-[#0B1F3A] text-white hover:bg-[#132d52]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Enregistrement...
            </span>
          ) : service ? (
            "Enregistrer les modifications"
          ) : (
            "Ajouter le service"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ServiceArtisanForm;