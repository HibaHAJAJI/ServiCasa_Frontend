import { useCallback, useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth/AuthContext";
import avisService from "@/services/avisService";
import userService from "@/services/userService";

const STARS = [1, 2, 3, 4, 5];

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

const clientLabel = (avis) => {
  const nom = [avis?.clientPrenom, avis?.clientNom].filter(Boolean).join(" ").trim();
  if (nom) return nom;
  return avis?.clientId ? `Client #${avis.clientId}` : "Client";
};

function AvisArtisan() {
  const { token } = useAuth();
  const artisanIdRef = useRef(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [avis, setAvis] = useState([]);
  const [moyenne, setMoyenne] = useState(0);
  const [nombreAvis, setNombreAvis] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resolveArtisanId = useCallback(async () => {
    if (artisanIdRef.current) return artisanIdRef.current;

    if (!token && !localStorage.getItem("token")) {
      return null;
    }

    try {
      const profile = await userService.getCurrentUser();
      const profileRole = profile?.role
        ? profile.role.replace("ROLE_", "").toUpperCase()
        : "";

      if (profileRole && profileRole !== "ARTISAN") {
        return null;
      }

      if (profile?.id) {
        artisanIdRef.current = profile.id;
        return profile.id;
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du profil artisan :", err);
    }

    return null;
  }, [token]);

  const chargerAvis = () => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const id = await resolveArtisanId();

        if (!active) return;

        if (!id) {
          setError("Impossible d'identifier votre profil artisan.");
          return;
        }

        const [avisData, moyenneData, nombreData] = await Promise.all([
          avisService.getAvisByArtisan(id, 0, 50),
          avisService.getMoyenneArtisan(id),
          avisService.getNombreAvisArtisan(id),
        ]);

        if (!active) return;

        const liste = Array.isArray(avisData) ? avisData : avisData?.content || [];

        setAvis(liste);
        setMoyenne(Number(moyenneData) || 0);
        setNombreAvis(Number(nombreData) || liste.length);
      } catch (err) {
        if (!active) return;
        console.error(err);
        setError("Impossible de charger vos avis. Veuillez réessayer.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [resolveArtisanId, reloadKey]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Mes avis</h1>
        <p className="mt-1 text-sm text-slate-500">
          Les avis laissés par vos clients sur vos interventions terminées.
        </p>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0B1F3A]" />
            <p className="mt-3 text-sm text-slate-500">Chargement...</p>
          </CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-red-500">{error}</p>
            <button
              type="button"
              onClick={chargerAvis}
              className="mt-4 rounded-xl bg-[#0B1F3A] px-4 py-2 text-sm text-white hover:bg-[#132d52]"
            >
              Réessayer
            </button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <>
          {nombreAvis > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center">
                {STARS.map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= Math.round(Number(moyenne) || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-[#0B1F3A]">
                Note moyenne : {(Number(moyenne) || 0).toFixed(1)} / 5
              </p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {nombreAvis} avis
              </span>
            </div>
          )}

          {avis.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-sm text-slate-500">Aucun avis pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {avis.map((item) => (
                <Card
                  key={item.id}
                  className="border-slate-200 bg-white shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-[#0B1F3A]">
                        {clientLabel(item)}
                      </p>

                      <div className="flex items-center">
                        {STARS.map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= item.note
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {item.commentaire && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {item.commentaire}
                      </p>
                    )}

                    {formatDate(item.dateCreation) && (
                      <p className="mt-3 text-xs text-slate-400">
                        Le {formatDate(item.dateCreation)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AvisArtisan;
