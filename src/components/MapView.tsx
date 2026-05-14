import { useState, useCallback } from "react";
import MapGL, { type Viewport } from "@urbica/react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { DetectiveMarker } from "./DetectiveMarker";
import { InvestigationSite } from "./InvestigationSite";
import type { GeoLocation } from "../hooks/useGeolocation";
import type { MapCircle } from "../types/map";

interface MapViewProps {
  location: GeoLocation;
  circles?: MapCircle[];
}

// OpenStreetMap streets style (no token required)
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export function MapView({ location, circles = [] }: MapViewProps) {
  // Always center on the detective (user) location on first load
  const [viewport, setViewport] = useState<Viewport>({
    latitude: location.latitude,
    longitude: location.longitude,
    zoom: 15,
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
        <DetectiveMarker
          latitude={location.latitude}
          longitude={location.longitude}
        />
        {circles.length > 0 && <InvestigationSite circles={circles} />}
      </MapGL>
    </div>
  );
}
