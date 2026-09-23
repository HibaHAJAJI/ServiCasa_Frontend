import {  Tag, FileText, } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServiceArtisanDetails = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#0B1F3A] mb-2">
            <Tag size={12} />
            {service.categorieNom || "Sans catégorie"}
          </span>
          <h3 className="text-xl font-bold text-[#0B1F3A]">{service.nom}</h3>
        </div>

        {service.tarif != null && (
          <div className="text-right shrink-0 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 uppercase font-medium block">Tarif</span>
            <span className="text-lg font-bold text-[#0B1F3A]">{service.tarif} DH</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText size={14} />
            Description
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
            {service.description || "Aucune description fournie pour ce service."}
          </p>
        </div>
      </div>

      {onClose && (
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Fermer
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceArtisanDetails;