import { useMemo, useState, useCallback } from "react";
import { Source, Layer, Marker } from "@urbica/react-map-gl";
import type { MapCircle } from "../types/map";
import { circlesToGeoJSON } from "../utils/geoCircle";

interface MapCirclesProps {
  circles: MapCircle[];
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

interface PanelInfo {
  index: number;
  circle: MapCircle;
}

export function MapCircles({
  circles,
  fillColor = "rgba(26, 115, 232, 0.25)",
  fillOpacity = 1,
  strokeColor = "rgba(26, 115, 232, 0.8)",
  strokeWidth = 2,
}: MapCirclesProps) {
  const geojson = useMemo(() => circlesToGeoJSON(circles), [circles]);
  const [panelInfo, setPanelInfo] = useState<PanelInfo | null>(null);

  const handleMarkerClick = useCallback(
    (index: number) => {
      setPanelInfo({ index, circle: circles[index] });
    },
    [circles]
  );

  const handleClosePanel = useCallback(() => {
    setPanelInfo(null);
  }, []);

  return (
    <>
      <Source id="circles-source" type="geojson" data={geojson}>
        <Layer
          id="circles-fill"
          type="fill"
          source="circles-source"
          paint={{
            "fill-color": fillColor,
            "fill-opacity": fillOpacity,
          }}
        />
        <Layer
          id="circles-stroke"
          type="line"
          source="circles-source"
          paint={{
            "line-color": strokeColor,
            "line-width": strokeWidth,
          }}
        />
      </Source>

      {/* Jumping question mark at the center of each circle */}
      {circles.map((circle, index) => (
        <Marker
          key={index}
          latitude={circle.lat}
          longitude={circle.lng}
          anchor="center"
        >
          <div
            className="jumping-question-mark"
            aria-label="Unknown area"
            onClick={() => handleMarkerClick(index)}
          >
            <span>?</span>
          </div>
        </Marker>
      ))}

      {/* Bottom panel */}
      <div className={`info-panel ${panelInfo ? "info-panel--open" : ""}`}>
        {panelInfo && (
          <>
            <button
              className="info-panel__close"
              onClick={handleClosePanel}
              aria-label="Close panel"
            >
              ✕
            </button>
            <h3 className="info-panel__title">🔍 Mystery Zone #{panelInfo.index + 1}</h3>
            <p className="info-panel__text">
              A suspicious area has been detected! The zone covers a radius of{" "}
              <strong>{panelInfo.circle.radius}m</strong> around coordinates{" "}
              ({panelInfo.circle.lat.toFixed(4)}, {panelInfo.circle.lng.toFixed(4)}).
            </p>
            <p className="info-panel__text">
              Investigate this location to uncover clues and solve the mystery.
            </p>
          </>
        )}
      </div>
    </>
  );
}
