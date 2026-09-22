import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import avisService from "@/services/avisService";

const AvisArtisan = () => {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [moyenne, setMoyenne] = useState(0);
  const [nombreAvis, setNombreAvis] = useState(0);
  const [artisanId, setArtisanId] = useState(null);

  const fetchAvis = async () => {
    if (!artisanId) return;
    try {
      setLoading(true);
      const data = await avisService.getAvisByArtisan(artisanId, page, size);
      setAvis(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les avis.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!artisanId) return;
    try {
      const [moy, count] = await Promise.all([
        avisService.getMoyenneArtisan(artisanId),
        avisService.getNombreAvisArtisan(artisanId),
      ]);
      setMoyenne(moy || 0);
      setNombreAvis(count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getArtisanId = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("http://localhost:8081/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const user = await response.json();
          if (user.role === "ARTISAN") {
            setArtisanId(user.id);
            await fetchStats();
            await fetchAvis();
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    getArtisanId();
  }, []);

  useEffect(() => {
    fetchAvis();
  }, [page, size, artisanId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderStars = (note, size = "text-lg") => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${size} ${
              star <= note ? "text-amber-400" : "text-slate-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0B1F3A] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl max-w-lg mx-auto mt-10 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  if (!artisanId) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl max-w-lg mx-auto mt-10 text-slate-600 font-medium">
        Vous devez être connecté en tant qu'artisan pour voir vos avis.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Note moyenne</h3>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
              <span className="text-5xl font-bold text-[#0B1F3A]">{moyenne.toFixed(1)}</span>
              <div>
                {renderStars(Math.round(moyenne), "text-2xl")}
                <p className="text-sm text-slate-500 mt-1">{nombreAvis} avis</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-end border-t md:border-t-0 md:border-l md:pl-6 pt-6 md:pt-0">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-slate-600 w-8 text-right">{star}★</span>
                <div className="flex-1 max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${nombreAvis > 0 ? (avis.filter(a => a.note === star).length / nombreAvis) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm text-slate-500 w-10">
                  {nombreAvis > 0 ? Math.round((avis.filter(a => a.note === star).length / nombreAvis) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {avis.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-xs">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-slate-800 font-semibold text-base mb-1">Aucun avis pour le moment</h3>
          <p className="text-slate-400 text-sm">Les avis de vos clients apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {avis.map((a) => (
            <Card key={a.id} className="border-gray-200 bg-white shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-700">
                        {a.clientPrenom?.[0] || "C"}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0B1F3A]">
                          {a.clientPrenom ? `${a.clientPrenom} ${a.clientNom || ""}` : "Client"}
                        </p>
                        <p className="text-sm text-slate-500">{formatDate(a.dateCreation)}</p>
                      </div>
                      <div className="ml-auto">
                        {renderStars(a.note, "text-xl")}
                      </div>
                    </div>

                    {a.commentaire && (
                      <p className="text-slate-700 leading-relaxed pl-12 sm:pl-0">
                        "{a.commentaire}"
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Précédent
              </Button>
              <span className="text-sm text-slate-600">
                Page {page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Suivant
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvisArtisan;