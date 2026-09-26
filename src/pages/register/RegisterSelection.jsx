import { FaUser, FaBriefcase, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RegisterSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-5">
      <div className="w-full max-w-[680px] rounded-[20px] border border-slate-100 bg-white px-6 py-10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:px-9">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-[26px] font-bold text-[#0b1f3a]">
            Créer un compte
          </h1>

          <p className="text-sm text-slate-500">
            Comment souhaitez-vous utiliser ServiCasa ?
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col items-start rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] bg-white text-[#0b1f3a] shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
              <FaUser size={20} />
            </div>

            <span className="mb-2.5 rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-800">
              Particulier
            </span>

            <h2 className="mb-2 text-xl font-bold text-[#0b1f3a]">
              Client
            </h2>

            <p className="mb-5 flex-grow text-[13px] leading-[1.5] text-slate-500">
              Je cherche un artisan pour mes travaux et services à domicile.
            </p>

            <Button
              type="button"
              variant="outline"
              className="h-auto w-full rounded-lg border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-[#0b1f3a] hover:bg-slate-100 hover:text-[#0b1f3a]"
              onClick={() => navigate("/register/client")}
            >
              <span>Créer un compte Client</span>
              <FaChevronRight className="ml-1.5" size={14} />
            </Button>
          </div>

          <div className="flex flex-col items-start rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] bg-white text-[#0b1f3a] shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
              <FaBriefcase size={20} />
            </div>

            <span className="mb-2.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
              Professionnel certifié
            </span>

            <h2 className="mb-2 text-xl font-bold text-[#0b1f3a]">
              Artisan
            </h2>

            <p className="mb-5 flex-grow text-[13px] leading-[1.5] text-slate-500">
              Je propose mes services professionnels aux particuliers.
            </p>

            <Button
              type="button"
              variant="outline"
              className="h-auto w-full rounded-lg border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-[#0b1f3a] hover:bg-slate-100 hover:text-[#0b1f3a]"
              onClick={() => navigate("/register/artisan")}
            >
              <span>Devenir Artisan</span>
              <FaChevronRight className="ml-1.5" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelection;