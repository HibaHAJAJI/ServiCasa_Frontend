import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaTools, FaStar } from "react-icons/fa";

import heroImage from "../assets/image.png";

const Hero = ({ onSearch, onUseMyPosition, locating }) => {
  const [specialite, setSpecialite] = useState("");
  const [ville, setVille] = useState("");

  const handleSearch = () => {
    onSearch?.(specialite, ville);
  };

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <div className="inline-block mb-6 px-4 py-2 rounded-full bg-red-50 text-red-500 text-sm font-semibold">
                Des artisans qualifiés près de chez vous
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-[#0B1F3A]">
                Trouver le bon artisan
                <span className="block text-[#FF3038] mt-1">
                  pour vos travaux
                </span>
              </h1>

              <p className="mt-6 text-lg text-[#64748B] leading-relaxed max-w-lg">
                Besoin d'un plombier, électricien, peintre ou autre
                professionnel ? Trouvez facilement un artisan qualifié
                près de chez vous et réservez votre intervention en toute
                simplicité.
              </p>

              <div className="mt-8">
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row md:items-center">
                  <label className="flex flex-1 items-center gap-3 rounded-xl px-4">
                    <FaTools className="shrink-0 text-[#0B1F3A]" />
                    <select
                      value={specialite}
                      onChange={(e) => setSpecialite(e.target.value)}
                      className="w-full cursor-pointer bg-transparent py-2 text-sm font-medium text-[#0B1F3A] outline-none"
                    >
                      <option value="">Toutes les spécialités</option>
                      <option value="Plomberie">Plomberie</option>
                      <option value="Électricité">Électricité</option>
                      <option value="Peinture">Peinture</option>
                      <option value="Climatisation">Climatisation</option>
                    </select>
                  </label>

                  <div className="hidden w-px bg-slate-200 md:block" />

                  <label className="flex flex-1 items-center gap-3 rounded-xl px-4">
                    <FaMapMarkerAlt className="shrink-0 text-[#0B1F3A]" />
                    <input
                      type="text"
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      placeholder="Votre ville"
                      className="w-full bg-transparent py-2 text-sm font-medium text-[#0B1F3A] outline-none placeholder:text-slate-400"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#132d52]"
                  >
                    <FaSearch className="text-sm" />
                    Rechercher
                  </button>
                </div>

                <button
                  type="button"
                  disabled={locating}
                  onClick={() => onUseMyPosition?.((value) => setVille(value))}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaMapMarkerAlt className="text-xs" />
                  {locating ? "Localisation en cours..." : "Utiliser ma position"}
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <div>
                    <span className="font-bold text-[#0B1F3A]">4.8/5</span>
                    <span className="text-sm text-slate-500 ml-2">Satisfaction client</span>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-6 bg-slate-200" />
                <div>
                  <span className="font-bold text-[#0B1F3A]">+500</span>
                  <span className="text-sm text-slate-500 ml-2">Artisans vérifiés</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/comment-ca-marche"
                  className="text-sm font-semibold text-[#0B1F3A] hover:text-red-500 transition"
                >
                  Découvrir comment ça marche →
                </Link>
              </div>
            </div>

            <div className="relative w-full">
              <div className="relative">
                <div className="absolute -inset-3 bg-red-50 rounded-[2rem] -z-10" />
                <img
                  src={heroImage}
                  alt="Client et artisan ServiCasa"
                  className="w-full h-[420px] sm:h-[500px] lg:h-[560px] object-cover rounded-[2rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;