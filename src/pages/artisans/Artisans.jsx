import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import artisanService from "@/services/artisanService";
import ArtisanCard from "@/components/ArtisanCard";

const Artisans = () => {
  const [artisans, setArtisans] = useState([]);
  const [specialite, setSpecialite] = useState("");
  const [ville, setVille] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchArtisans = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await artisanService.searchArtisans(
        specialite,
        ville
      );

      setArtisans(
        Array.isArray(data) ? data : data?.content || []
      );
    } catch (error) {
      console.error(error);
      setError("Impossible de charger les artisans.");
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadArtisans = async () => {
      await fetchArtisans();
    };

    loadArtisans();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchArtisans();
  };

  const handleViewProfile = (id) => {
    navigate(`/artisans/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1F3A]">
          Trouver un artisan
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Découvrez nos artisans qualifiés et réservez une
          intervention en quelques clics.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
      >
        <input
          type="text"
          placeholder="Spécialité..."
          value={specialite}
          onChange={(e) => setSpecialite(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
        />

        <input
          type="text"
          placeholder="Ville..."
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-[#0B1F3A] hover:bg-[#132d52] text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
        >
          <Search size={16} />
          Rechercher
        </button>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0B1F3A] rounded-full animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="p-6 text-center text-red-500 bg-red-50 rounded-2xl border border-red-200">
          {error}
        </div>
      )}

      {!loading && !error && artisans.length === 0 && (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          Aucun artisan trouvé.
        </div>
      )}

      {!loading && !error && artisans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artisans.map((artisan) => (
            <ArtisanCard
              key={artisan.id}
              artisan={artisan}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Artisans;