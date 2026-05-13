import { useState, useCallback } from "react";
import MapGL, { type Viewport } from "@urbica/react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { UserMarker } from "./UserMarker";
import type { GeoLocation } from "../hooks/useGeolocation";

interface MapViewProps {
  location: GeoLocation;
}

// Free OpenStreetMap-based vector tile style (no token required)
const MAP_STYLE = "https://demotiles.maplibre.org/style.json";

export function MapView({ location }: MapViewProps) {
  const [viewport, setViewport] = useState<Viewport>({
    latitude: location.latitude,
    longitude: location.longitude,
    zoom: 14,
  });

  const handleViewportChange = useCallback((newViewport: Viewport) => {
    setViewport(newViewport);
  }, []);

  return (
    <div className="map-container">
      <MapGL
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        onViewportChange={handleViewportChange}
      >
        <UserMarker
          latitude={location.latitude}
          longitude={location.longitude}
        />
      </MapGL>
    </div>
  );
}
