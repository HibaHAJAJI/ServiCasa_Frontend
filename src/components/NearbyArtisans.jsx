import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import {
  MapPin,
  Star,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const getInitials = (prenom = "", nom = "") => {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
};

const ArtisanMap = ({ artisans = [] }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const container = mapContainerRef.current;

    if (!container || mapRef.current) {
      return;
    }

    const map = L.map(container);

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    map.setView([31.7917, -7.0926], 6);

    artisans.forEach((artisan) => {
      const latitude = parseFloat(artisan.latitude);
      const longitude = parseFloat(artisan.longitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        return;
      }

      const nom =
        `${artisan.prenom || ""} ${artisan.nom || ""}`.trim();

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`
          <strong>${nom || "Artisan"}</strong>
          <br />
          ${artisan.specialite || ""}
          <br />
          ${artisan.ville || ""}
        `);
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mapRef.current || mapRef.current !== map) {
          return;
        }

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("Votre position");

        map.setView([latitude, longitude], 12);
      },
      () => {}
    );

    return () => {
      if (mapRef.current === map) {
        mapRef.current = null;
      }

      map.remove();
    };
  }, [artisans]);

  return (
    <div
      ref={mapContainerRef}
      className="h-[360px] w-full"
    />
  );
};

const NearbyArtisans = ({
  artisans = [],
  onViewProfile,
  loading = false,
  error = "",
}) => {
  const nearbyArtisans = artisans.slice(0, 4);

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0B1F3A]">
            Artisans près de chez vous
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Des professionnels qualifiés et vérifiés, prêts à intervenir.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {loading && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-slate-500">
                    Recherche en cours...
                  </p>
                </CardContent>
              </Card>
            )}

            {!loading && error && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                </CardContent>
              </Card>
            )}

            {!loading &&
              !error &&
              nearbyArtisans.length > 0 &&
              nearbyArtisans.map((artisan) => (
                <Card
                  key={artisan.id}
                  className="transition hover:shadow-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] text-xs font-semibold text-white">
                          {getInitials(
                            artisan.prenom || "",
                            artisan.nom || ""
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <h3 className="truncate text-sm font-semibold text-[#0B1F3A]">
                              {artisan.prenom} {artisan.nom}
                            </h3>

                            {artisan.verified && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                            )}
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {artisan.specialite ||
                              "Spécialité non renseignée"}

                            {artisan.ville && (
                              <> · {artisan.ville}</>
                            )}
                          </p>
                        </div>
                      </div>

                      {artisan.tarif != null && (
                        <span className="shrink-0 text-xs font-bold text-[#0B1F3A]">
                          {artisan.tarif} DH/h
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {artisan.specialite && (
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                            {artisan.specialite}
                          </span>
                        )}

                        {artisan.note != null && (
                          <span className="flex items-center gap-1 text-xs text-slate-600">
                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                            {artisan.note}
                          </span>
                        )}

                        {artisan.disponible != null && (
                          <span className="flex items-center gap-1 text-xs">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                artisan.disponible
                                  ? "bg-green-500"
                                  : "bg-slate-300"
                              }`}
                            />

                            <span
                              className={
                                artisan.disponible
                                  ? "text-green-600"
                                  : "text-slate-400"
                              }
                            >
                              {artisan.disponible
                                ? "Disponible"
                                : "Indisponible"}
                            </span>
                          </span>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onViewProfile?.(artisan.id)
                        }
                      >
                        Voir profil
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {!loading &&
              !error &&
              nearbyArtisans.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-sm text-slate-500">
                      Aucun artisan trouvé.
                    </p>
                  </CardContent>
                </Card>
              )}
          </div>

          <Card className="overflow-hidden">
            <div className="flex h-11 items-center gap-2 border-b px-4">
              <MapPin className="h-4 w-4 text-[#0B1F3A]" />

              <span className="text-xs font-semibold text-[#0B1F3A]">
                Carte des artisans
              </span>
            </div>

            <ArtisanMap artisans={nearbyArtisans} />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NearbyArtisans;