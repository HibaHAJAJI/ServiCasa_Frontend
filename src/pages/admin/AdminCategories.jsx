import { useEffect, useState } from "react";
import api from "@/services/axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Plus, Search, Edit, Trash2 } from "lucide-react";

// Extrait le message d'erreur renvoyé par le backend (validation, ResponseStatusException, ...)
const getApiErrorMessage = (err, fallback) => {
  const data = err?.response?.data;
  if (data?.nom) return data.nom;
  if (data?.message) return data.message;
  if (data && typeof data === "object") {
    const first = Object.values(data).find((v) => typeof v === "string");
    if (first) return first;
  }
  return fallback;
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ nom: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // silent = true : rafraîchit la liste sans afficher le spinner global
  const fetchCategories = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError("");
      const response = await api.get("/categories?page=0&size=1000");
      const data = response.data;
      const list = Array.isArray(data) ? data : data?.content || [];
      setCategories(list);
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Impossible de charger les catégories."));
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const filteredCategories = categories.filter((c) =>
    c.nom?.toLowerCase().includes(search.trim().toLowerCase())
  );

  const openCreateModal = () => {
    setEditing(null);
    setFormData({ nom: "" });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditing(cat);
    setFormData({ nom: cat.nom || "" });
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setFormData({ nom: "" });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nom = formData.nom.trim();
    if (!nom) {
      setFormError("Le nom est obligatoire.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const payload = { nom };

      if (editing) {
        await api.put(`/categories/${editing.id}`, payload);
      } else {
        await api.post("/categories", payload);
      }

      closeModal();
      await fetchCategories(true);
      showSuccess(
        editing
          ? `Catégorie « ${nom} » modifiée avec succès.`
          : `Catégorie « ${nom} » ajoutée avec succès.`
      );
    } catch (err) {
      console.error(err);
      setFormError(
        getApiErrorMessage(err, "Erreur lors de l'enregistrement.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Supprimer la catégorie « ${nom} » ?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      await fetchCategories(true);
      showSuccess(`Catégorie « ${nom} » supprimée.`);
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err, "Erreur lors de la suppression."));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Gestion des Catégories</h1>
          <p className="text-sm text-slate-500 mt-1">Gérer les catégories de services.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-[#0B1F3A] hover:bg-[#132d52] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {loading && (
        <Card>
          <CardContent className="p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0B1F3A]" />
            <p className="mt-3 text-sm text-slate-500">Chargement...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center text-red-600">
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess("");
                fetchCategories();
              }}
              className="mt-4"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Nom
                    </TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="px-4 py-8 text-center text-slate-500">
                        {search.trim()
                          ? "Aucune catégorie ne correspond à votre recherche"
                          : "Aucune catégorie trouvée"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((cat) => (
                      <TableRow
                        key={cat.id}
                        className="transition-colors hover:bg-slate-50 border-t border-slate-100"
                      >
                        <TableCell className="px-4 py-4 font-medium text-[#0B1F3A]">
                          {cat.nom}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(cat)}
                              className="h-8 gap-1.5 text-xs"
                            >
                              <Edit size={13} />
                              <span className="hidden sm:inline">Modifier</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(cat.id, cat.nom)}
                              className="h-8 gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                              <span className="hidden sm:inline">Supprimer</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">
              {editing ? "Modifier la catégorie" : "Ajouter une catégorie"}
            </h2>

            {formError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Nom de la catégorie"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0B1F3A] hover:bg-[#132d52]"
                >
                  {submitting
                    ? "Envoi en cours..."
                    : editing
                    ? "Enregistrer"
                    : "Créer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
