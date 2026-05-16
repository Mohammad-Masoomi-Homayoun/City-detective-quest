import { useState, useCallback } from "react";
import MapGL, { type Viewport } from "@urbica/react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Detective } from "./Detective";
import { InvestigationSite as InvestigationSiteLayer } from "./InvestigationSite";
import type { GeoLocation } from "../hooks/useGeolocation";
import type { InvestigationSite } from "../types/investigationSite";

interface MapViewProps {
  location: GeoLocation;
  circles?: InvestigationSite[];
  activeCircleIndex?: number;
  onMarkerClick?: (index: number) => void;
}

// OpenStreetMap streets style (no token required)
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export function MapView({ location, circles = [], activeCircleIndex = -1, onMarkerClick }: MapViewProps) {
  // Always center on the detective (user) location on first load
  const [viewport, setViewport] = useState<Viewport>({
    latitude: location.latitude,
    longitude: location.longitude,
    zoom: 17,
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
        <Detective
          latitude={location.latitude}
          longitude={location.longitude}
        />
        {circles.length > 0 && <InvestigationSiteLayer circles={circles} userLocation={location} activeCircleIndex={activeCircleIndex} onMarkerClick={onMarkerClick} />}
      </MapGL>
    </div>
  );
}
