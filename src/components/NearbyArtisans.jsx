import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import ArtisanCard from "./ArtisanCard";

const ArtisanMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const container = mapContainerRef.current;

    if (!container || mapRef.current) {
      return;
    }

    const map = L.map(container);

    mapRef.current = map;

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap",
      }
    ).addTo(map);

    map.setView([31.7917, -7.0926], 6);

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
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="h-[300px] w-full sm:h-[360px]"
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
    <section id="artisans" className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0B1F3A] sm:text-2xl">
            Artisans près de chez vous
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Des professionnels qualifiés et vérifiés, prêts à intervenir.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <div className="min-w-0 space-y-3">
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
                <ArtisanCard
                  key={artisan.id}
                  artisan={artisan}
                  onViewProfile={onViewProfile}
                />
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

          <Card className="min-w-0 overflow-hidden">
            <div className="flex h-11 items-center gap-2 border-b px-4">
              <MapPin className="h-4 w-4 text-[#0B1F3A]" />

              <span className="text-xs font-semibold text-[#0B1F3A] sm:text-sm">
                Carte des artisans
              </span>
            </div>

            <ArtisanMap />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NearbyArtisans;