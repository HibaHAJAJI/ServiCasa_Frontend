import { useState } from "react";
import {
  FaSearch,
  FaWrench,
  FaMapMarkerAlt
} from "react-icons/fa";

import PrivateNavbar from "../../components/navbar/PrivateNavbar";
import Sidebar from "../../components/sidebar/Sidebar";
import artisanService from "../../services/artisanService";

import { villes } from "../../data/villes";
import { specialites } from "../../data/specialites";

import "./Dashboard.css";

const Dashboard = () => {
  const [specialite, setSpecialite] = useState("");
  const [ville, setVille] = useState("");
  const [showCities, setShowCities] = useState(false);
  const [artisans, setArtisans] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  /* =========================
     VILLES FILTREES
  ========================= */
  const filteredCities = villes.filter((item) =>
    item.toLowerCase().includes(ville.toLowerCase())
  );

  /* =========================
     RECHERCHE
  ========================= */
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setIsSearching(true);
      setHasSearched(true);
      let results = [];

      /* SPECIALITE + VILLE */
      if (specialite && ville) {
        const response = await artisanService.searchBySpecialite(specialite);
        const list = Array.isArray(response) ? response : response?.content || [];
        results = list.filter(
          (artisan) => artisan.ville?.toLowerCase() === ville.toLowerCase()
        );
      }
      /* SPECIALITE SEULEMENT */
      else if (specialite) {
        const response = await artisanService.searchBySpecialite(specialite);
        results = Array.isArray(response) ? response : response?.content || [];
      }
      /* VILLE SEULEMENT */
      else if (ville) {
        const response = await artisanService.searchByVille(ville);
        results = Array.isArray(response) ? response : response?.content || [];
      }
      /* AUCUN FILTRE */
      else {
        results = [];
      }

      setArtisans(results);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      setArtisans([]);
    } finally {
      setIsSearching(false);
    }
  };

  /* =========================
     SELECTION VILLE
  ========================= */
  const handleCitySelect = (selectedCity) => {
    setVille(selectedCity);
    setShowCities(false);
  };

  return (
    <div className="dashboard">
      <PrivateNavbar />

      <div className="dashboard-body">
        <Sidebar />

        <main className="dashboard-content">
          {/* HEADER */}
          <div className="dashboard-header">
            <h1>Trouvez votre artisan</h1>
            <p>Trouvez facilement un artisan qualifié près de chez vous.</p>
          </div>

          {/* SEARCH BAR */}
          <form className="search-bar-container" onSubmit={handleSearch}>
            {/* SPECIALITE */}
            <div className="search-input-group specialite-group">
              <FaWrench className="search-field-icon" />
              <div className="search-field-content">
                <label>SPÉCIALITÉ</label>
                <select
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                >
                  <option value="">Toutes les spécialités</option>
                  {specialites.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* VILLE */}
            <div className="search-input-group city-group">
              <FaMapMarkerAlt className="search-field-icon" />
              <div className="search-field-content city-field">
                <label>VILLE</label>
                <input
                  type="text"
                  placeholder="Ville, département..."
                  value={ville}
                  onChange={(e) => {
                    setVille(e.target.value);
                    setShowCities(true);
                  }}
                  onFocus={() => setShowCities(true)}
                />

                {/* AUTOCOMPLETE */}
                {showCities && ville && (
                  <div className="city-dropdown">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((item) => (
                        <button
                          type="button"
                          key={item}
                          className="city-option"
                          onClick={() => handleCitySelect(item)}
                        >
                          <FaMapMarkerAlt />
                          <span>{item}</span>
                        </button>
                      ))
                    ) : (
                      <div className="city-no-result">Aucune ville trouvée</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* SEARCH BUTTON */}
            <button
              type="submit"
              className="search-submit-btn"
              disabled={isSearching}
            >
              <FaSearch />
              <span>{isSearching ? "Recherche..." : "Lancer la recherche"}</span>
            </button>
          </form>

          {/* RESULTS */}
          <section className="dashboard-card">
            <div className="results-header">
              <h2>Résultats de recherche</h2>
              {hasSearched && !isSearching && (
                <span className="results-count">
                  {artisans.length} artisan{artisans.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {!hasSearched && (
              <div className="empty-message">
                <FaSearch />
                <p>Sélectionnez une spécialité ou saisissez une ville pour commencer.</p>
              </div>
            )}

            {hasSearched && isSearching && (
              <div className="empty-message">
                <p>Recherche en cours...</p>
              </div>
            )}

            {hasSearched && !isSearching && artisans.length === 0 && (
              <div className="empty-message">
                <FaSearch />
                <p>Aucun artisan trouvé.</p>
                <span>Essayez une autre spécialité ou une autre ville.</span>
              </div>
            )}

            {hasSearched && !isSearching && artisans.length > 0 && (
              <div className="artisan-results-grid">
                {artisans.map((artisan) => (
                  <div className="artisan-result-card" key={artisan.id}>
                    <div className="artisan-result-header">
                      <div className="artisan-avatar">
                        {artisan.prenom?.charAt(0)}
                        {artisan.nom?.charAt(0)}
                      </div>
                      <div className="artisan-result-info">
                        <strong>
                          {artisan.prenom} {artisan.nom}
                        </strong>
                        <span className="artisan-specialite">
                          <FaWrench />
                          {artisan.specialite}
                        </span>
                      </div>
                    </div>
                    <div className="artisan-result-details">
                      <span>
                        <FaMapMarkerAlt />
                        {artisan.ville}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;