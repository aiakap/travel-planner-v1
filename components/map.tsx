"use client";

import { Location } from "@/app/generated/prisma";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface MapProps {
  itineraries: Location[];
}

const containerStyle = { width: "100%", height: "100%" };

export default function Map({ itineraries }: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script", // prevents duplicate script loads
    googleMapsApiKey: apiKey || "",
  });

  if (!apiKey) return <div>Missing Google Maps API key.</div>;
  if (loadError) return <div>Error loading maps.</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  const center =
    itineraries.length > 0
      ? { lat: itineraries[0].lat, lng: itineraries[0].lng }
      : { lat: 0, lng: 0 };

  return (
    <GoogleMap mapContainerStyle={containerStyle} zoom={8} center={center}>
      {itineraries.map((location, key) => (
        <Marker
          key={key}
          position={{ lat: location.lat, lng: location.lng }}
          title={location.locationTitle}
        />
      ))}
    </GoogleMap>
  );
}
