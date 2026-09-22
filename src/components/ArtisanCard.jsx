import { CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const getInitials = (prenom = "", nom = "") => {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
};

const hasValue = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== "";

const ArtisanCard = ({ artisan, onViewProfile }) => {
  const firstName = hasValue(artisan.prenom) ? artisan.prenom : "";
  const lastName = hasValue(artisan.nom) ? artisan.nom : "";

  return (
    <Card 
      onClick={() => onViewProfile?.(artisan.id)}
      className="w-full cursor-pointer transition hover:shadow-md hover:border-slate-300"
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] text-xs font-semibold text-white sm:h-11 sm:w-11">
              {getInitials(artisan.prenom || "", artisan.nom || "")}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="truncate text-sm font-semibold text-[#0B1F3A] sm:text-base">
                  {firstName} {lastName}
                </h3>

                {artisan.verified && (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                )}
              </div>

              <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                {hasValue(artisan.specialite)
                  ? artisan.specialite
                  : "Spécialité non renseignée"}

                {hasValue(artisan.ville) && (
                  <> · {artisan.ville}</>
                )}
              </p>
            </div>
          </div>

          {hasValue(artisan.tarifHoraire) && (
            <span className="shrink-0 text-xs font-bold text-[#0B1F3A] sm:text-sm">
              {artisan.tarifHoraire} DH/h
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {hasValue(artisan.specialite) && (
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 sm:text-xs">
                {artisan.specialite}
              </span>
            )}

            {artisan.disponible != null && (
              <span className="flex items-center gap-1 text-xs">
                <span
                  className={`h-2 w-2 rounded-full ${
                    artisan.disponible ? "bg-green-500" : "bg-slate-300"
                  }`}
                />
                <span
                  className={
                    artisan.disponible ? "text-green-600" : "text-slate-400"
                  }
                >
                  {artisan.disponible ? "Disponible" : "Indisponible"}
                </span>
              </span>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full shrink-0 sm:w-auto"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile?.(artisan.id);
            }}
          >
            Voir profil
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtisanCard;