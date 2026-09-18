import { useEffect, useState } from "react";
import adminDashboardService from "../../services/adminDashboardService";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PendingArtisansAdmin = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingArtisans = async () => {
      try {
        const data = await adminDashboardService.getPendingArtisans(0, 10);
        setArtisans(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement des artisans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingArtisans();
  }, []);

  const handleUpdateStatus = async (id, nouveauStatut) => {
    try {
      await adminDashboardService.updateArtisanStatus(id, nouveauStatut);
      const data = await adminDashboardService.getPendingArtisans(0, 10);
      setArtisans(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500 w-full">
        Chargement des artisans...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-red-500 w-full">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs w-full">
      <div className="w-full">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="border border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Nom
              </TableHead>
              <TableHead className="border border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </TableHead>
              <TableHead className="border border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Statut
              </TableHead>
              <TableHead className="border border-gray-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artisans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="border border-gray-200 py-8 text-center text-sm text-gray-500"
                >
                  Aucun artisan en attente de validation
                </TableCell>
              </TableRow>
            ) : (
              artisans.map((artisan) => (
                <TableRow
                  key={artisan.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="border border-gray-200 px-4 py-3 font-medium text-[#0B1F3A]">
                    {artisan.nom} {artisan.prenom}
                  </TableCell>
                  <TableCell className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                    {artisan.email}
                  </TableCell>
                  <TableCell className="border border-gray-200 px-4 py-3">
                    <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">
                      {artisan.statutCompte}
                    </span>
                  </TableCell>
                  <TableCell className="border border-gray-200 px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          handleUpdateStatus(artisan.id, "ACCEPTE")
                        }
                        className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(artisan.id, "REFUSE")
                        }
                        className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                      >
                        Refuser
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PendingArtisansAdmin;