import { CheckCircle2, Clock3, XCircle } from "lucide-react";

const jours = {
  MONDAY: "Lundi",
  TUESDAY: "Mardi",
  WEDNESDAY: "Mercredi",
  THURSDAY: "Jeudi",
  FRIDAY: "Vendredi",
  SATURDAY: "Samedi",
  SUNDAY: "Dimanche",
};

const DisponibiliteDetails = ({ disponibilite }) => {
  const disponible = disponibilite.disponible;

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1F3A]/10">
        <Clock3 className="h-5 w-5 text-[#0B1F3A]" />
      </div>

      <div>
        <p className="font-semibold text-[#0B1F3A]">
          {jours[disponibilite.jour] || disponibilite.jour}
        </p>

        {disponible ? (
          <p className="mt-1 text-sm text-slate-500">
            {disponibilite.heureDebut} - {disponibilite.heureFin}
          </p>
        ) : (
          <p className="mt-1 text-sm text-slate-500">
            Jour de repos
          </p>
        )}
      </div>

      <div
        className={`ml-2 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
          disponible
            ? "bg-green-50 text-green-600"
            : "bg-red-50 text-red-600"
        }`}
      >
        {disponible ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : (
          <XCircle className="h-3.5 w-3.5" />
        )}

        {disponible ? "Disponible" : "Repos"}
      </div>
    </div>
  );
};

export default DisponibiliteDetails;