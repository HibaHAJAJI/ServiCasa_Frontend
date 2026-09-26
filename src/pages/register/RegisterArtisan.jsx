import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { artisanSchema } from "../../validation/artisanSchema";
import authService from "../../services/authService";
import artisanService from "../../services/artisanService";
import { useNavigate } from "react-router-dom";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import VilleSelect from "../../components/filters/VilleSelect";
import SpecialiteSelect from "../../components/filters/SpecialiteSelect";

import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBriefcase,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const RegisterArtisan = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [villes, setVilles] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(true);

  const navigate = useNavigate();

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
      } finally {
        setFiltersLoading(false);
      }
    };

    loadFilters();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(artisanSchema),
    mode: "onTouched",
    defaultValues: {
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      password: "",
      ville: "",
      specialite: "",
      anneesExperience: "",
      tarifHoraire: "",
      zoneIntervention: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    setApiError("");

    try {
      await authService.registerArtisan(data);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setApiError(
        err?.response?.data?.message || "Erreur lors de l'inscription"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border p-6 md:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Créer votre compte Artisan
          </h1>

          <p className="text-sm text-slate-500">
            Remplissez le formulaire pour rejoindre ServiCasa.
          </p>
        </div>

        {apiError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Nom"
                  className="w-full pl-9 h-10 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  {...register("nom")}
                />
              </div>
              {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Prénom"
                  className="w-full pl-9 h-10 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  {...register("prenom")}
                />
              </div>
              {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="tel"
                  placeholder="06XXXXXXXX"
                  className="w-full pl-9 h-10 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  {...register("telephone")}
                />
              </div>
              {errors.telephone && <p className="text-xs text-red-500 mt-1">{errors.telephone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
              <Controller
                name="ville"
                control={control}
                rules={{ required: "La ville est obligatoire" }}
                render={({ field }) => (
                  <VilleSelect
                    villes={villes}
                    value={field.value || ""}
                    onChange={(value) => {
                      field.onChange(value);
                      field.onBlur();
                    }}
                    disabled={filtersLoading}
                  />
                )}
              />
              {errors.ville && <p className="text-xs text-red-500 mt-1">{errors.ville.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="email"
                placeholder="exemple@mail.com"
                className="w-full pl-9 h-10 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 h-10 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Spécialité</label>
              <Controller
                name="specialite"
                control={control}
                rules={{ required: "La spécialité est obligatoire" }}
                render={({ field }) => (
                  <SpecialiteSelect
                    specialites={specialites}
                    value={field.value || ""}
                    onChange={(value) => {
                      field.onChange(value);
                      field.onBlur();
                    }}
                    disabled={filtersLoading}
                  />
                )}
              />
              {errors.specialite && <p className="text-xs text-red-500 mt-1">{errors.specialite.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Années d'expérience</label>
              <div className="relative">
                <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="number"
                  placeholder="Ex: 5"
                  className="w-full pl-9 h-10 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  {...register("anneesExperience")}
                />
              </div>
              {errors.anneesExperience && <p className="text-xs text-red-500 mt-1">{errors.anneesExperience.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tarif horaire (DH)</label>
              <div className="relative">
                <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex: 150"
                  className="w-full pl-9 h-10 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  {...register("tarifHoraire")}
                />
              </div>
              {errors.tarifHoraire && <p className="text-xs text-red-500 mt-1">{errors.tarifHoraire.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Zone d'intervention</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Ex: Maârif, Agdal..."
                  className="w-full pl-9 h-10 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  {...register("zoneIntervention")}
                />
              </div>
              {errors.zoneIntervention && <p className="text-xs text-red-500 mt-1">{errors.zoneIntervention.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <Textarea
              rows={3}
              placeholder="Présentez vos services..."
              className="w-full"
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={filtersLoading}
          >
            <span>S'inscrire</span>
            <FaArrowRight className="ml-2" size={14} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterArtisan;