import { useMemo, useState, useCallback, useEffect } from "react";
import { Source, Layer, Marker } from "@urbica/react-map-gl";
import type { InvestigationSite } from "../types/investigationSite";
import type { GeoLocation } from "../hooks/useGeolocation";
import { circlesToGeoJSON } from "../utils/geoCircle";
import { haversineDistance } from "../utils/distance";
import failedImg from "../assets/failed.avif";
import solvedImg from "../assets/solved.png";

interface InvestigationSiteProps {
  circles: InvestigationSite[];
  userLocation: GeoLocation;
  activeCircleIndex?: number;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

interface PanelInfo {
  index: number;
  circle: InvestigationSite;
}

/* InvestigationSite component*/
export function InvestigationSite({
  circles,
  userLocation,
  activeCircleIndex = -1,
  fillColor = "rgba(26, 115, 232, 0.25)",
  fillOpacity = 1,
  strokeColor = "rgba(26, 115, 232, 0.8)",
  strokeWidth = 2,
}: InvestigationSiteProps) {
  const openCircles = useMemo(
    () => circles.filter((c) => c.status === "OPEN"),
    [circles]
  );
  const geojson = useMemo(() => circlesToGeoJSON(openCircles), [openCircles]);
  const [panelInfo, setPanelInfo] = useState<PanelInfo | null>(null);

  // Auto-open panel and vibrate when detective enters a zone
  useEffect(() => {
    if (activeCircleIndex !== -1) {
      setPanelInfo({ index: activeCircleIndex, circle: circles[activeCircleIndex] });

      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    }
  }, [activeCircleIndex, circles]);

  const handleMarkerClick = useCallback(
    (index: number) => {
      setPanelInfo({ index, circle: circles[index] });

      // Vibrate on mobile
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }

      // Browser notification on desktop
      if (!navigator.vibrate && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("🔍 Investigation Site", {
            body: `Zone #${index + 1} — ${circles[index].status}`,
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("🔍 Investigation Site", {
                body: `Zone #${index + 1} — ${circles[index].status}`,
              });
            }
          });
        }
      }
    },
    [circles]
  );

  const handleClosePanel = useCallback(() => {
    setPanelInfo(null);
  }, []);

  return (
    <>
      <Source id="investigation-site-source" type="geojson" data={geojson}>
        <Layer
          id="investigation-site-fill"
          type="fill"
          source="investigation-site-source"
          paint={{
            "fill-color": fillColor,
            "fill-opacity": fillOpacity,
          }}
        />
        <Layer
          id="investigation-site-stroke"
          type="line"
          source="investigation-site-source"
          paint={{
            "line-color": strokeColor,
            "line-width": strokeWidth,
          }}
        />
      </Source>

      {/* Marker at the center of each circle based on status */}
      {circles.map((circle, index) => (
        <Marker
          key={index}
          latitude={circle.lat}
          longitude={circle.lng}
          anchor="center"
        >
          {circle.status === "FAILED" ? (
            <div
              className="site-marker"
              aria-label="Failed investigation"
              onClick={() => handleMarkerClick(index)}
            >
              <img src={failedImg} alt="Failed" width="38" height="38" />
            </div>
          ) : circle.status === "SOLVED" ? (
            <div
              className="site-marker"
              aria-label="Solved investigation"
              onClick={() => handleMarkerClick(index)}
            >
              <img src={solvedImg} alt="Solved" width="38" height="38" />
            </div>
          ) : (
            <div
              className="jumping-question-mark"
              aria-label="Open investigation"
              onClick={() => handleMarkerClick(index)}
            >
              <span>?</span>
            </div>
          )}
        </Marker>
      ))}

      {/* Investivation Site Info panel — hidden when detective is inside a zone */}
      {activeCircleIndex === -1 && (
        <div className={`info-panel ${panelInfo ? "info-panel--visible" : ""} ${panelInfo ? `info-panel--${panelInfo.circle.status.toLowerCase()}` : ""}`}>
          {panelInfo && (
            <>
              <button
                className="info-panel__close"
                onClick={handleClosePanel}
                aria-label="Close panel"
              >
                ✕
              </button>
              <h3 className="info-panel__title">🔍 {panelInfo.circle.title}</h3>
              <p className="info-panel__text">
                <strong>Distance:</strong>{" "}
                {Math.round(
                  haversineDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    panelInfo.circle.lat,
                    panelInfo.circle.lng
                  )
                )}m away from you
              </p>
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
      )}
    </>
  );
}
