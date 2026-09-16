import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTools,
  FaHome,
  FaUserEdit,
} from "react-icons/fa";
import userService from "../../services/userService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userEmail =
    localStorage.getItem("userEmail") || "karim.benali@gmail.com";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getCurrentUser(userEmail);
        console.log("PROFILE DATA :", data);
        setUser(data);
      } catch (error) {
        console.error("Erreur profile :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0B1F3A] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-red-500">
        Impossible de charger le profil.
      </div>
    );
  }

  const role = user.role?.replace("ROLE_", "").toUpperCase();

  const initials = `${user.prenom?.[0] || ""}${user.nom?.[0] || ""}`
    .toUpperCase();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-xl font-bold">
                {initials || "SC"}
              </div>

              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {user.prenom} {user.nom}
              </h2>
            </div>
          </div>

          <button
            onClick={() => alert("Modification bientôt disponible")}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition"
          >
            <FaUserEdit />
            Modifier
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-5">
            Informations générales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <Info
              label="Prénom & Nom"
              value={`${user.prenom || ""} ${user.nom || ""}`}
            />

            <Info
              label="Ville"
              value={user.ville}
              icon={<FaMapMarkerAlt />}
            />

            <Info
              label="Adresse e-mail"
              value={user.email}
              icon={<FaEnvelope />}
            />

            <Info
              label="Téléphone"
              value={user.telephone}
              icon={<FaPhone />}
            />
          </div>
        </div>

        {role === "ARTISAN" && (
          <div className="p-6 border-t border-slate-100">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#0B1F3A] mb-5">
              <FaTools />
              Informations professionnelles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <Info
                label="Spécialité"
                value={user.specialite || "Non spécifiée"}
              />

              <Info
                label="Années d'expérience"
                value={
                  user.anneesExperience !== null &&
                  user.anneesExperience !== undefined
                    ? `${user.anneesExperience} ans`
                    : "Non spécifiée"
                }
              />

              <Info
                label="Tarif horaire"
                value={
                  user.tarifHoraire !== null &&
                  user.tarifHoraire !== undefined
                    ? `${user.tarifHoraire} DH / h`
                    : "Non spécifié"
                }
              />

              <Info
                label="Zone d'intervention"
                value={user.zoneIntervention || "Non spécifiée"}
              />

              <div className="md:col-span-2">
                <p className="text-xs text-slate-400 mb-1">Description</p>
                <p className="text-sm text-slate-700">
                  {user.description || "Aucune description"}
                </p>
              </div>
            </div>
          </div>
        )}

        {role === "CLIENT" && (
          <div className="p-6 border-t border-slate-100">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#0B1F3A] mb-5">
              <FaHome />
              Informations client
            </h3>

            <Info
              label="Adresse"
              value={user.adresse || "Aucune adresse enregistrée"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, value, icon }) => {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>

      <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
        {icon && <span className="text-slate-400">{icon}</span>}
        {value || "Non renseigné"}
      </p>
    </div>
  );
};

export default Profile;