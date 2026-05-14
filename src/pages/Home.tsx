import { useGeolocation } from "../hooks/useGeolocation";
import { useProximityAlert } from "../hooks/useProximityAlert";
import { MapView } from "../components/MapView";
import { investigationSites } from "../data/investigationSites";

export function Home() {
  const { location, loading, error } = useGeolocation();
  const { insideCircleIndex, showNotification, dismissNotification } =
    useProximityAlert(location, investigationSites);

  if (loading) {
    return (
      <div className="status-screen">
        <div className="status-content">
          <div className="spinner" />
          <p>Detecting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {error && (
        <div className="error-banner">
          <p>
            ⚠️ Could not get your location: {error}. Showing default location
            (Eindhoven).
          </p>
        </div>
      )}

      {showNotification && insideCircleIndex !== -1 && (
        <div className="proximity-notification">
          <div className="proximity-notification__content">
            <span className="proximity-notification__icon">🔍</span>
            <div>
              <strong>You entered a mystery zone!</strong>
              <p>
                Zone #{insideCircleIndex + 1} — Radius:{" "}
                {investigationSites[insideCircleIndex].radius}m
              </p>
            </div>
            <button
              className="proximity-notification__dismiss"
              onClick={dismissNotification}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <MapView location={location} circles={investigationSites} />
    </div>
  );
}
