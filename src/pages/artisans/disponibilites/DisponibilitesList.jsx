import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import DisponibiliteDetails from "../disponibilites/DisponibiliteDetails";

const DisponibilitesList = ({
  disponibilites,
  onEdit,
  onDelete,
}) => {
  if (!disponibilites.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
        <p className="font-medium text-slate-700">
          Aucune disponibilité
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Ajoutez vos jours et horaires de travail.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {disponibilites.map((disponibilite) => (
        <div
          key={disponibilite.id}
          className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 md:flex-row md:items-center md:justify-between"
        >
          <DisponibiliteDetails
            disponibilite={disponibilite}
          />

          <div className="flex gap-2 md:ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit(disponibilite)}
              className="border-slate-200"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onDelete(disponibilite.id)}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisponibilitesList;