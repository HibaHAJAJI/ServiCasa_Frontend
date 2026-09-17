import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTools,
  FaHome,
  FaUserEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import userService from "../../services/userService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await userService.getCurrentUser();
        console.log("PROFILE DATA :", data);
        setUser(data);
        setFormData(data);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const role = user?.role?.replace("ROLE_", "").toUpperCase();

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("DONNÉES ENVOYÉES AU BACKEND :", formData);

      let updatedUser;

      if (role === "CLIENT") {
        updatedUser = await userService.updateClientProfile(formData);
      } else if (role === "ARTISAN") {
        updatedUser = await userService.updateArtisanProfile(formData);
      } else {
        updatedUser = await userService.updateProfile(formData);
      }

      setUser(updatedUser);
      setFormData(updatedUser);
      setIsEditing(false);

      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0B1F3A] rounded-full animate-spin"></div>
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

  const initials =
    (user.prenom?.[0] || "") + (user.nom?.[0] || "");

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-xl font-bold">
                {initials || "SC"}
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {user.prenom} {user.nom}
              </h2>
              <span className="text-xs text-slate-500 uppercase font-semibold">
                {role}
              </span>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50"
            >
              <FaUserEdit />
              Modifier
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
              >
                <FaTimes />
                Annuler
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3A] text-white rounded-xl text-sm hover:bg-[#13315c]"
              >
                <FaSave />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-5">
            Informations générales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <EditableField
              label="Prénom"
              name="prenom"
              value={isEditing ? formData.prenom : (user?.prenom || formData.prenom)}
              isEditing={isEditing}
              onChange={handleChange}
            />

            <EditableField
              label="Nom"
              name="nom"
              value={isEditing ? formData.nom : (user?.nom || formData.nom)}
              isEditing={isEditing}
              onChange={handleChange}
            />

            <EditableField
              label="Ville"
              name="ville"
              value={isEditing ? formData.ville : (user?.ville || formData.ville)}
              icon={<FaMapMarkerAlt />}
              isEditing={isEditing}
              onChange={handleChange}
            />

            <EditableField
              label="Adresse e-mail"
              name="email"
              value={formData.email}
              icon={<FaEnvelope />}
              isEditing={false}
            />

            <EditableField
              label="Téléphone"
              name="telephone"
              value={isEditing ? formData.telephone : (user?.telephone || formData.telephone)}
              icon={<FaPhone />}
              isEditing={isEditing}
              onChange={handleChange}
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
              <EditableField
                label="Spécialité"
                name="specialite"
                value={isEditing ? formData.specialite : (user?.specialite || formData.specialite)}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <EditableField
                label="Années d'expérience"
                name="anneesExperience"
                type="number"
                value={isEditing ? formData.anneesExperience : (user?.anneesExperience || formData.anneesExperience)}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <EditableField
                label="Tarif horaire"
                name="tarifHoraire"
                type="number"
                value={isEditing ? formData.tarifHoraire : (user?.tarifHoraire || formData.tarifHoraire)}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <EditableField
                label="Zone d'intervention"
                name="zoneIntervention"
                value={isEditing ? formData.zoneIntervention : (user?.zoneIntervention || formData.zoneIntervention)}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <p className="text-xs text-slate-400 mb-1">Description</p>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                ) : (
                  <p className="text-sm text-slate-700">
                    {user?.description || formData.description || "Aucune description"}
                  </p>
                )}
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

            <EditableField
              label="Adresse"
              name="adresse"
              value={isEditing ? formData.adresse : (user?.adresse || formData.adresse)}
              icon={<FaMapMarkerAlt />}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        )}

      </div>
    </div>
  );
};

const EditableField = ({
  label,
  name,
  value,
  icon,
  isEditing,
  onChange,
  type = "text",
}) => {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
        />
      ) : (
        <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          {value || "Non renseigné"}
        </p>
      )}
    </div>
  );
};

export default Profile;