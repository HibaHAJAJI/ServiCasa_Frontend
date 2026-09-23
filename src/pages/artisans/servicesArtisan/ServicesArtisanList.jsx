import { Eye, Pencil, Trash2, Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ServicesArtisanList = ({
  services = [],
  onDetails,
  onEdit,
  onDelete,
}) => {
  if (!services.length) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-xs">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <Briefcase className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-slate-800 font-semibold text-base mb-1">Aucun service</h3>
        <p className="text-slate-400 text-sm">Ajoutez les services que vous proposez à vos clients.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/70 border-b border-slate-100">
            <TableHead className="py-4 px-6 text-slate-500 uppercase text-xs font-semibold">Service</TableHead>
            <TableHead className="py-4 px-6 text-slate-500 uppercase text-xs font-semibold">Description</TableHead>
            <TableHead className="py-4 px-6 text-slate-500 uppercase text-xs font-semibold">Tarif</TableHead>
            <TableHead className="py-4 px-6 text-slate-500 uppercase text-xs font-semibold">Catégorie</TableHead>
            <TableHead className="py-4 px-6 text-right text-slate-500 uppercase text-xs font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((s) => (
            <TableRow key={s.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-100/80 last:border-b-0">
              <TableCell className="py-4 px-6 font-semibold text-[#0B1F3A]">
                {s.nom}
              </TableCell>
              <TableCell className="py-4 px-6 text-slate-600 text-xs max-w-xs truncate" title={s.description}>
                {s.description || <span className="text-slate-400 italic">Aucune description</span>}
              </TableCell>
              <TableCell className="py-4 px-6 font-semibold text-[#0B1F3A] whitespace-nowrap">
                {s.tarif != null ? `${s.tarif} DH` : "—"}
              </TableCell>
              <TableCell className="py-4 px-6 whitespace-nowrap">
                {s.categorieNom ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {s.categorieNom}
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">—</span>
                )}
              </TableCell>
              <TableCell className="py-4 px-6 text-right whitespace-nowrap">
                {onDetails && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDetails(s)}
                    className="h-8 gap-1.5 text-xs text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
                    title="Consulter les détails"
                  >
                    <Eye size={13} />
                    <span className="hidden sm:inline">Détails</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(s)}
                  className="h-8 gap-1.5 text-xs text-[#0B1F3A] border-slate-200 hover:bg-slate-100 ml-1.5 cursor-pointer"
                  title="Modifier le service"
                >
                  <Pencil size={13} />
                  <span className="hidden sm:inline">Modifier</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(s.id)}
                  className="h-8 gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 ml-1.5 cursor-pointer"
                  title="Supprimer le service"
                >
                  <Trash2 size={13} />
                  <span className="hidden sm:inline">Supprimer</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServicesArtisanList;