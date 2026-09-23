import { useEffect, useState } from "react";
import { Plus, X, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

import serviceArtisanService from "@/services/serviceArtisanService";
import { useAuth } from "@/context/auth/AuthContext";

import { Button } from "@/components/ui/button";

import ServiceArtisanForm from "@/pages/artisans/servicesArtisan/ServiceArtisanForm";
import ServicesArtisanList from "@/pages/artisans/servicesArtisan/ServicesArtisanList";
import ServiceArtisanDetails from "@/pages/artisans/servicesArtisan/ServiceArtisanDetails";

const ServicesArtisan = () => {
  const { token, isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [notification, setNotification] = useState(null);

  const notify = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await serviceArtisanService.getMyServices();
      const list = Array.isArray(data) ? data : (data?.content || []);
      setServices(list);
    } catch (err) {
      console.error("Erreur lors de la récupération des services :", err);
      const msg =
        err.response?.data?.message ||
        "Impossible de charger vos services pour le moment.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await serviceArtisanService.getCategories();
      const list = Array.isArray(data) ? data : (data?.content || []);
      setCategories(list);
    } catch (err) {
      console.error("Erreur lors de la récupération des catégories :", err);
      setCategories([]);
    }
  };

useEffect(() => {
  if (!token && !isAuthenticated) {
    return;
  }

  const loadData = async () => {
    await fetchServices();
    await fetchCategories();
  };

  loadData();
}, [token, isAuthenticated]);

  const openCreateModal = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditing(s);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleOpenDetails = (s) => {
    setSelectedDetail(s);
  };

  const handleCloseDetails = () => {
    setSelectedDetail(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);

      const payload = {
        nom: formData.nom,
        description: formData.description,
        tarif: formData.tarif,
        categorieId: formData.categorieId,
      };

      if (editing) {
        await serviceArtisanService.update(editing.id, payload);
        notify("Service mis à jour avec succès.", "success");
      } else {
        await serviceArtisanService.create(payload);
        notify("Service ajouté avec succès.", "success");
      }

      closeModal();
      await fetchServices();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      const msg =
        err.response?.data?.message ||
        "Une erreur est survenue lors de l'enregistrement du service.";
      notify(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;
    try {
      await serviceArtisanService.delete(id);
      notify("Service supprimé avec succès.", "success");
      if (selectedDetail?.id === id) {
        setSelectedDetail(null);
      }
      await fetchServices();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      const msg =
        err.response?.data?.message ||
        "Une erreur est survenue lors de la suppression du service.";
      notify(msg, "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0B1F3A] rounded-full animate-spin" />
        <span className="text-sm text-slate-500 font-medium">Chargement de vos services...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
      {notification && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm border shadow-sm transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Mes services</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gérez le catalogue des prestations que vous proposez sur ServiCasa.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-[#0B1F3A] hover:bg-[#132d52] text-white shadow-sm cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un service
        </Button>
      </div>

      {error ? (
        <div className="p-6 text-center bg-red-50 border border-red-200 rounded-2xl text-red-700 space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="font-medium text-sm">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchServices}
            className="border-red-300 text-red-700 hover:bg-red-100 gap-1.5 cursor-pointer"
          >
            <RefreshCw size={13} />
            Réessayer
          </Button>
        </div>
      ) : (
        <ServicesArtisanList
          services={services}
          onDetails={handleOpenDetails}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0B1F3A]">
                {editing ? "Modifier le service" : "Ajouter un nouveau service"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Fermer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <ServiceArtisanForm
                service={editing}
                onSubmit={handleSubmit}
                onCancel={closeModal}
                loading={submitting}
                categories={categories}
              />
            </div>
          </div>
        </div>
      )}

      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#0B1F3A]">Détails du service</h2>
              <button
                type="button"
                onClick={handleCloseDetails}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Fermer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <ServiceArtisanDetails
                service={selectedDetail}
                onClose={handleCloseDetails}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesArtisan;