"use client";

import { Segment } from "@/app/generated/prisma";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useState } from "react";

interface MapProps {
  segments: Segment[];
}

const containerStyle = { width: "100%", height: "100%" };

export default function Map({ segments }: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

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
          onClick={() => setActiveMarker(`start-${segment.id}`)}
        />,
        <Marker
          key={`end-${segment.id}-${key}`}
          position={{ lat: segment.endLat, lng: segment.endLng }}
          title={`End: ${segment.endTitle}`}
          label="E"
          onClick={() => setActiveMarker(`end-${segment.id}`)}
        />,
        activeMarker === `start-${segment.id}` && (
          <InfoWindow
            key={`start-info-${segment.id}-${key}`}
            position={{ lat: segment.startLat, lng: segment.startLng }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div className="text-sm">
              <div className="font-semibold">{segment.name}</div>
              <div>Start: {segment.startTitle}</div>
              {segment.startTime && (
                <div>{new Date(segment.startTime).toLocaleString()}</div>
              )}
              {segment.notes && <div className="text-xs mt-1">{segment.notes}</div>}
            </div>
          </InfoWindow>
        ),
        activeMarker === `end-${segment.id}` && (
          <InfoWindow
            key={`end-info-${segment.id}-${key}`}
            position={{ lat: segment.endLat, lng: segment.endLng }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div className="text-sm">
              <div className="font-semibold">{segment.name}</div>
              <div>End: {segment.endTitle}</div>
              {segment.endTime && (
                <div>{new Date(segment.endTime).toLocaleString()}</div>
              )}
              {segment.notes && <div className="text-xs mt-1">{segment.notes}</div>}
            </div>
          </InfoWindow>
        ),
      ])}
    </GoogleMap>
  );
}
