import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { clientSchema } from "../../validation/clientSchema";
import authService from "../../services/authService";
import artisanService from "../../services/artisanService";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import VilleSelect from "../../components/filters/VilleSelect";

import {
  FaUser,
  FaPhone,
  FaCity,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaHome,
  FaArrowRight,
} from "react-icons/fa";

const RegisterClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [villes, setVilles] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadVilles = async () => {
      try {
        const data = await artisanService.getVilles();
        setVilles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des villes :", err);
        setVilles([]);
      } finally {
        setFiltersLoading(false);
      }
    };

    loadVilles();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clientSchema),
    mode: "onTouched",
    defaultValues: {
      nom: "",
      prenom: "",
      telephone: "",
      ville: "",
      adresse: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await authService.registerClient(data);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-[580px] rounded-xl border border-slate-200 bg-white px-5 py-8 shadow-sm sm:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-[28px] font-bold text-[#0b132a]">
            Créer votre compte Client
          </h1>

          <p className="text-[15px] text-slate-500">
            Remplissez le formulaire pour rejoindre ServiCasa.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-800">Nom</label>

              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400" size={15} />

                <input
                  type="text"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 text-sm focus:border-[#0b132a] focus:bg-white"
                  {...register("nom")}
                />
              </div>

              {errors.nom && <p className="text-xs text-red-500">{errors.nom.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-800">Prénom</label>

              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400" size={15} />

                <input
                  type="text"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 text-sm focus:border-[#0b132a] focus:bg-white"
                  {...register("prenom")}
                />
              </div>

              {errors.prenom && <p className="text-xs text-red-500">{errors.prenom.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-800">Téléphone</label>

              <div className="relative">
                <FaPhone className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400" size={15} />

                <input
                  type="tel"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 text-sm focus:border-[#0b132a] focus:bg-white"
                  {...register("telephone")}
                />
              </div>

              {errors.telephone && <p className="text-xs text-red-500">{errors.telephone.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-800">Ville</label>

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
              {errors.ville && <p className="text-xs text-red-500">{errors.ville.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-800">Adresse</label>

            <div className="relative">
              <FaHome className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400" size={15} />

              <input
                type="text"
                className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 text-sm focus:border-[#0b132a] focus:bg-white"
                {...register("adresse")}
              />
            </div>

            {errors.adresse && <p className="text-xs text-red-500">{errors.adresse.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-800">Adresse email</label>

            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400" size={15} />

              <input
                type="email"
                className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 text-sm focus:border-[#0b132a] focus:bg-white"
                {...register("email")}
              />
            </div>

            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-800">Mot de passe</label>

            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400" size={15} />

              <input
                type={showPassword ? "text" : "password"}
                className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-10 text-sm focus:border-[#0b132a] focus:bg-white"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>

            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            className="mt-1 h-11 w-full rounded-lg bg-[#0b132a] text-sm font-semibold text-white hover:bg-[#1a2544]"
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

export default RegisterClient;