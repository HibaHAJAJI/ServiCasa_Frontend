import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaTools, FaStar } from "react-icons/fa";

import heroImage from "../assets/image.png";

const Hero = () => {
  const navigate = useNavigate();

  const [specialite, setSpecialite] = useState("");
  const [ville, setVille] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (specialite) {
      params.append("specialite", specialite);
    }

    if (ville.trim()) {
      params.append("ville", ville.trim());
    }

    navigate(`/artisans?${params.toString()}`);
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
                <div className="flex flex-col md:flex-row gap-3 bg-white border border-slate-200 rounded-2xl p-2 shadow-lg">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100">
                    <FaTools className="text-[#0B1F3A] shrink-0" />
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Spécialité
                      </label>

                      <select
                        value={specialite}
                        onChange={(e) => setSpecialite(e.target.value)}
                        className="w-full bg-transparent text-sm font-medium text-[#0B1F3A] outline-none cursor-pointer"
                      >
                        <option value="">
                          Toutes les spécialités
                        </option>

                        <option value="Plomberie">
                          Plomberie
                        </option>

                        <option value="Électricité">
                          Électricité
                        </option>

                        <option value="Peinture">
                          Peinture
                        </option>

                        <option value="Climatisation">
                          Climatisation
                        </option>
                      </select>
                    </div>

                  </div>

                  <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100">

                    <FaMapMarkerAlt className="text-[#0B1F3A] shrink-0" />

                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Ville
                      </label>

                      <input
                        type="text"
                        value={ville}
                        onChange={(e) => setVille(e.target.value)}
                        placeholder="Votre ville"
                        className="w-full bg-transparent text-sm font-medium text-[#0B1F3A] outline-none placeholder:text-slate-400"
                      />
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="md:w-auto w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0B1F3A] text-white font-semibold hover:bg-[#132d52] transition"
                  >
                    <FaSearch className="text-sm" />
                    Rechercher
                  </button>

                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">

                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />

                  <div>
                    <span className="font-bold text-[#0B1F3A]">
                      4.8/5
                    </span>

                    <span className="text-sm text-slate-500 ml-2">
                      Satisfaction client
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-6 bg-slate-200" />

                <div>
                  <span className="font-bold text-[#0B1F3A]">
                    +500
                  </span>

                  <span className="text-sm text-slate-500 ml-2">
                    Artisans vérifiés
                  </span>
                </div>

                <div className="hidden sm:block w-px h-6 bg-slate-200" />

                <div>
                  <span className="font-bold text-[#0B1F3A]">
                    24h
                  </span>

                  <span className="text-sm text-slate-500 ml-2">
                    Réponse rapide
                  </span>
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

                <div className="absolute top-6 right-6 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">

                  <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center">
                    <FaStar className="text-yellow-400" />
                  </div>

                  <div>
                    <p className="font-bold text-[#0B1F3A]">
                      4.8/5
                    </p>

                    <p className="text-xs text-slate-500">
                      Satisfaction client
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
};

export default Hero;