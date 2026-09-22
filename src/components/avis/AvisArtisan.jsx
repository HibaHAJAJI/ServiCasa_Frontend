import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import avisService from "@/services/avisService";

function AvisArtisan() {
  const [avis, setAvis] = useState([]);
  const [moyenne, setMoyenne] = useState(0);
  const [nombreAvis, setNombreAvis] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chargerAvis = async () => {
      try {
        const artisanId = localStorage.getItem("artisanId");

        const avisData =
          await avisService.getAvisByArtisan(artisanId);

        const moyenneData =
          await avisService.getMoyenneArtisan(artisanId);

        const nombreData =
          await avisService.getNombreAvisArtisan(artisanId);

        setAvis(avisData.content || avisData);
        setMoyenne(moyenneData);
        setNombreAvis(nombreData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    chargerAvis();
  }, []);

  if (loading) {
    return <p className="p-6">Chargement...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#0B1F3A]">
        Mes avis
      </h1>

      <p className="text-gray-500 mb-6">
        Les avis de mes clients
      </p>

      <div className="mb-6">
        <p className="font-semibold">
          Note moyenne : {Number(moyenne).toFixed(1)} / 5
        </p>

        <p className="text-gray-500">
          {nombreAvis} avis
        </p>
      </div>

      {avis.length === 0 ? (
        <p className="text-gray-500">
          Aucun avis pour le moment.
        </p>
      ) : (
        <div className="space-y-4">
          {avis.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4"
            >
              <p className="font-semibold">
                {item.client?.prenom} {item.client?.nom}
              </p>

              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= item.note
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {item.commentaire && (
                <p className="mt-2 text-gray-600">
                  {item.commentaire}
                </p>
              )}

              {item.dateCreation && (
                <p className="mt-2 text-sm text-gray-400">
                  {new Date(
                    item.dateCreation
                  ).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AvisArtisan;