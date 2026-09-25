import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/axios";
import paiementService from "@/services/paiementService";

export default function PaiementPage() {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [paiement, setPaiement] = useState(null);
  const [modePaiement, setModePaiement] = useState("CASH");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const resReservation = await api.get(`/reservations/${reservationId}`);
        setReservation(resReservation.data);

        const resPaiement = await paiementService.getByReservation(reservationId);
        setPaiement(resPaiement);
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [reservationId]);

  const handlePayer = async () => {
    try {
      const nouveauPaiement = await paiementService.create({
        reservationId: Number(reservationId),
        modePaiement: modePaiement,
      });
      setPaiement(nouveauPaiement);
      alert("Paiement réussi !");
    } catch (err) {
      alert("Erreur lors du paiement");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Chargement en cours...</div>;
  }

  return (
    <div className="mx-auto max-w-lg p-6 bg-white rounded-lg shadow">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 mb-4">
        ← Retour
      </button>

      <h1 className="text-xl font-bold text-[#0B1F3A] mb-4">Simulation de Paiement</h1>

      <div className="space-y-2 mb-6">
        <p><strong>Réservation #{reservation?.id}</strong></p>
        <p>Artisan : {reservation?.artisanPrenom} {reservation?.artisanNom}</p>
        <p className="text-lg font-bold text-[#0B1F3A]">
          Montant : {paiement?.montant ?? reservation?.prixTotal} DH
        </p>
      </div>

      {!paiement ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mode de paiement</label>
            <select 
              value={modePaiement} 
              onChange={(e) => setModePaiement(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="CASH">CASH</option>
              <option value="CARTE">CARTE</option>
              <option value="VIREMENT">VIREMENT</option>
            </select>
          </div>

          <button 
            onClick={handlePayer}
            className="w-full bg-[#0B1F3A] text-white py-2 rounded font-medium hover:bg-opacity-90"
          >
            Confirmer le paiement
          </button>
        </div>
      ) : (
        <div className="p-4 bg-green-50 text-green-700 rounded text-center font-medium">
          Paiement déjà effectué ({paiement.modePaiement}) - Statut : {paiement.statutPaiement}
        </div>
      )}
    </div>
  );
}