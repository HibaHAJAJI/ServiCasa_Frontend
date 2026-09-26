import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PublicNavbar from "../components/navbar/PublicNavbar";
import Hero from "../components/Hero";
import NearbyArtisans from "@/components/NearbyArtisans";
import artisanService from "@/services/artisanService";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/auth/AuthContext";

const normalizeArtisan = (artisan) => ({
  id: artisan?.id,
  prenom: artisan?.prenom,
  nom: artisan?.nom,
  specialite: artisan?.specialite,
  ville: artisan?.ville,
  tarifHoraire: artisan?.tarifHoraire,
});

const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
          "Accept-Language": "fr",
        },
      }
    );

    const data = await response.json();
    const address = data?.address ?? {};

    return (
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      ""
    );
  } catch {
    return "";
  }
};

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  const [villes, setVilles] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(true);

  const handleSearch = async (specialite = null, ville = null) => {
    setLoading(true);
    setError("");

    try {
      const s = (specialite?.nom || "").trim();
      const v = (ville?.nom || "").trim();

      const res = await artisanService.searchArtisans(s, v);
      const items = res?.content ?? [];

      setResults(items.map(normalizeArtisan));
    } catch {
      setError("Impossible de rechercher les artisans.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await artisanService.getVilles();
        setVilles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des villes :", err);
        setVilles([]);
      }

      try {
        const data = await artisanService.getSpecialites();
        const list = Array.isArray(data) ? data : (data?.content || []);
        setSpecialites(list);
      } catch (err) {
        console.error("Erreur lors de la récupération des spécialités :", err);
        setSpecialites([]);
      }

      setFiltersLoading(false);
    };

    loadFilters();
  }, []);

  useEffect(() => {
    const loadArtisans = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await artisanService.searchArtisans("", "");
        const items = res?.content ?? [];

        setResults(items.map(normalizeArtisan));
      } catch {
        setError("Impossible de charger les artisans.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadArtisans();
  }, []);

  const handleUseMyPosition = async (onVille) => {
    if (!navigator.geolocation) {
      setError(
        "La géolocalisation n'est pas prise en charge par ce navigateur."
      );
      return;
    }

    setLocating(true);
    setError("");

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const ville = await reverseGeocode(latitude, longitude);

      if (ville) {
        onVille?.(ville);
      }
    } catch {
      setError(
        "Impossible d'obtenir votre position. Activez la géolocalisation."
      );
    } finally {
      setLocating(false);
    }
  };

  const handleViewProfile = (id) => {
    if (isAuthenticated) {
      navigate(`/artisans/${id}`);
    } else {
      navigate("/login", {
        state: {
          from: {
            pathname: `/artisans/${id}`,
          },
        },
      });
    }
  };

  return (
    <>
      <PublicNavbar />

      <Hero
        onSearch={handleSearch}
        onUseMyPosition={handleUseMyPosition}
        locating={locating}
        villes={villes}
        specialites={specialites}
        filtersLoading={filtersLoading}
      />

      <NearbyArtisans
        artisans={results}
        onViewProfile={handleViewProfile}
        loading={loading}
        error={error}
      />

      <HowItWorks />

      <Footer />
    </>
  );
};

export default Home;