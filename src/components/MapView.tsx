import { useState, useCallback } from "react";
import MapGL, { type Viewport } from "@urbica/react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { UserMarker } from "./UserMarker";
import { MapCircles } from "./MapCircles";
import type { GeoLocation } from "../hooks/useGeolocation";
import type { MapCircle } from "../types/map";
import { getCirclesCenter } from "../utils/geoCircle";

interface MapViewProps {
  location: GeoLocation;
  circles?: MapCircle[];
}

// OpenStreetMap streets style (no token required)
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export function MapView({ location, circles = [] }: MapViewProps) {
  // Center on circles average if provided, otherwise on user location
  const center =
    circles.length > 0 ? getCirclesCenter(circles) : location;

  const [viewport, setViewport] = useState<Viewport>({
    latitude: center.latitude,
    longitude: center.longitude,
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
        <UserMarker
          latitude={location.latitude}
          longitude={location.longitude}
        />
        {circles.length > 0 && <MapCircles circles={circles} />}
      </MapGL>
    </div>
  );
}
