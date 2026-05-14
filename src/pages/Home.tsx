import { useGeolocation } from "../hooks/useGeolocation";
import { MapView } from "../components/MapView";
import { mockCircles } from "../data/mockCircles";

export function Home() {
  const { location, loading, error } = useGeolocation();

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
      <MapView location={location} circles={mockCircles} />
    </div>
  );
}
