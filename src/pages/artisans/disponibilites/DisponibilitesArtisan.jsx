import { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/auth/AuthContext";
import disponibiliteService from "@/services/disponibiliteService";
import userService from "@/services/userService";

import DisponibiliteForm from "./DisponibiliteForm";
import DisponibilitesList from "./DisponibilitesList";
import DisponibiliteDetails from "./DisponibiliteDetails";

const DisponibilitesArtisan = () => {
  const { user, token } = useAuth();
  const [artisanId, setArtisanId] = useState(user?.artisanId || user?.id || null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState("");

  const resolveArtisanId = useCallback(async () => {
    if (artisanId) return artisanId;

    const directId = user?.artisanId || user?.id || user?.userId;
    const tokenRole = user?.role ? user.role.replace("ROLE_", "").toUpperCase() : "";

    if (directId && (!tokenRole || tokenRole === "ARTISAN")) {
      setArtisanId(directId);
      return directId;
    }

    const activeToken = token || localStorage.getItem("token");
    if (!activeToken) {
      return null;
    }

    if (tokenRole && tokenRole !== "ARTISAN") {
      return null;
    }

    try {
      const profile = await userService.getCurrentUser();
      const profileRole = profile?.role ? profile.role.replace("ROLE_", "").toUpperCase() : "";

      if (profileRole && profileRole !== "ARTISAN") {
        return null;
      }

      if (profile?.id) {
        setArtisanId(profile.id);
        return profile.id;
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du profil artisan :", err);
    }

    return null;
  }, [artisanId, token, user]);

  const loadDisponibilites = useCallback(async (targetId) => {
    let id = targetId || artisanId;
    if (!id) {
      id = await resolveArtisanId();
    }
    if (!id) return;

    try {
      setLoadingList(true);
      setError("");

      const response = await disponibiliteService.getByArtisan(id);

      const data = Array.isArray(response)
        ? response
        : response?.content || response?.data || [];

      setDisponibilites(data);
    } catch (err) {
      console.error("Erreur chargement disponibilités :", err);

      setDisponibilites([]);
      setError("Impossible de charger les disponibilités.");
    } finally {
      setLoadingList(false);
    }
  }, [artisanId, resolveArtisanId]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        setLoadingList(true);
        setError("");

        const activeToken = token || localStorage.getItem("token");
        if (!activeToken) {
          if (!cancelled) {
            setError("Artisan non connecté.");
            setLoadingList(false);
          }
          return;
        }

        const tokenRole = user?.role ? user.role.replace("ROLE_", "").toUpperCase() : "";
        if (tokenRole && tokenRole !== "ARTISAN") {
          if (!cancelled) {
            setError("Artisan non connecté.");
            setLoadingList(false);
          }
          return;
        }

        let currentId = user?.artisanId || user?.id || user?.userId;

        if (!currentId) {
          try {
            const profile = await userService.getCurrentUser();
            const profileRole = profile?.role ? profile.role.replace("ROLE_", "").toUpperCase() : "";

            if (profileRole && profileRole !== "ARTISAN") {
              if (!cancelled) {
                setError("Artisan non connecté.");
                setLoadingList(false);
              }
              return;
            }

            currentId = profile?.id;
          } catch (err) {
            console.error("Erreur récupération profil artisan :", err);
            if (!cancelled) {
              setError("Artisan non connecté.");
              setLoadingList(false);
            }
            return;
          }
        }

        if (!currentId) {
          if (!cancelled) {
            setError("Artisan non connecté.");
            setLoadingList(false);
          }
          return;
        }

        if (!cancelled) {
          setArtisanId(currentId);
        }

        const response = await disponibiliteService.getByArtisan(currentId);

        const data = Array.isArray(response)
          ? response
          : response?.content || response?.data || [];

        if (!cancelled) {
          setDisponibilites(data);
          setError("");
        }
      } catch (err) {
        console.error("Erreur chargement disponibilités :", err);

        if (!cancelled) {
          setDisponibilites([]);
          setError("Impossible de charger les disponibilités.");
        }
      } finally {
        if (!cancelled) {
          setLoadingList(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleAdd = () => {
    setSelected(null);
    setError("");
    setShowForm(true);
  };

  const handleEdit = (disponibilite) => {
    setSelected(disponibilite);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    let currentId = artisanId;
    if (!currentId) {
      currentId = await resolveArtisanId();
    }

    if (!currentId) {
      setError("Artisan non connecté.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        jour: data.jour,
        heureDebut: data.heureDebut || null,
        heureFin: data.heureFin || null,
        disponible: Boolean(data.disponible),
        artisanId: currentId,
      };

      if (selected) {
        await disponibiliteService.update(selected.id, payload);
      } else {
        await disponibiliteService.create(payload);
      }

      await loadDisponibilites(currentId);

      setSelected(null);
      setShowForm(false);
    } catch (error) {
      console.error("Erreur enregistrement disponibilité :", error);

      setError(
        error?.response?.data?.message ||
          "Impossible d'enregistrer la disponibilité."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      await disponibiliteService.delete(id);

      const currentId = artisanId || (await resolveArtisanId());
      await loadDisponibilites(currentId);

      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (error) {
      console.error("Erreur suppression disponibilité :", error);

      setError(
        error?.response?.data?.message ||
          "Impossible de supprimer la disponibilité."
      );
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!showForm && (
        <div className="flex justify-end">
          <Button
            onClick={handleAdd}
            className="bg-[#0B1F3A] hover:bg-[#132d52]"
          >
            Ajouter une disponibilité
          </Button>
        </div>
      )}

      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <DisponibiliteForm
            disponibilite={selected}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelected(null);
              setError("");
            }}
            loading={loading}
          />
        </div>
      )}

      {selected && !showForm && (
        <DisponibiliteDetails
          disponibilite={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-[#0B1F3A]">
          Liste des disponibilités
        </h2>

        {loadingList ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Chargement des disponibilités...
          </div>
        ) : (
          <DisponibilitesList
            disponibilites={disponibilites}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDetails={setSelected}
          />
        )}
      </div>
    </div>
  );
};

export default DisponibilitesArtisan;