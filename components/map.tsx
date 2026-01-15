"use client";

import { Segment } from "@/app/generated/prisma";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

interface MapProps {
  segments: Segment[];
}

const containerStyle = { width: "100%", height: "100%" };

export default function Map({ segments }: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script", // prevents duplicate script loads
    googleMapsApiKey: apiKey || "",
  });

  if (!apiKey) return <div>Missing Google Maps API key.</div>;
  if (loadError) return <div>Error loading maps.</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  const center =
    segments.length > 0
      ? { lat: segments[0].startLat, lng: segments[0].startLng }
      : { lat: 0, lng: 0 };

  return (
    <GoogleMap mapContainerStyle={containerStyle} zoom={8} center={center}>
      {segments.map((segment, key) => (
        <Polyline
          key={`line-${segment.id}-${key}`}
          path={[
            { lat: segment.startLat, lng: segment.startLng },
            { lat: segment.endLat, lng: segment.endLng },
          ]}
          options={{
            strokeColor: "#2563eb",
            strokeOpacity: 0.8,
            strokeWeight: 3,
          }}
        />
      ))}
      {segments.flatMap((segment, key) => [
        <Marker
          key={`start-${segment.id}-${key}`}
          position={{ lat: segment.startLat, lng: segment.startLng }}
          title={`Start: ${segment.startTitle}`}
          label="S"
        />,
        <Marker
          key={`end-${segment.id}-${key}`}
          position={{ lat: segment.endLat, lng: segment.endLng }}
          title={`End: ${segment.endTitle}`}
          label="E"
        />,
      ])}
    </GoogleMap>
  );
}
