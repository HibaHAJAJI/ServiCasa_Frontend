import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/navbar/PublicNavbar";
import Hero from "../components/Hero";
import NearbyArtisans from "@/components/NearbyArtisans";
import artisanService from "@/services/artisanService";
import HowItWorks from "@/components/HowItWorks";

const normalizeArtisan = (artisan) => ({
  id: artisan?.id,
  prenom: artisan?.prenom,
  nom: artisan?.nom,
  specialite: artisan?.specialite,
  ville: artisan?.ville,
  tarif: artisan?.tarifHoraire,
  note: artisan?.note,
  disponible: artisan?.disponible,
  latitude: artisan?.latitude,
  longitude: artisan?.longitude,
  verified: artisan?.verified,
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

  const [results, setResults] = useState([]);
  const [mapTarget, setMapTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  const handleSearch = async (specialite = "", ville = "") => {
    setLoading(true);
    setError("");

    try {
      const s = (specialite || "").trim();
      const v = (ville || "").trim();

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

      setMapTarget({ latitude, longitude });

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
    navigate(`/artisans/${id}`);
  };

  return (
    <>
      <PublicNavbar />
      <Hero
        onSearch={handleSearch}
        onUseMyPosition={handleUseMyPosition}
        locating={locating}
      />
      <NearbyArtisans
        artisans={results}
        onViewProfile={handleViewProfile}
        mapTarget={mapTarget}
        loading={loading}
        error={error}
      />
      <HowItWorks/>
    </>
  );
};

export default Home;