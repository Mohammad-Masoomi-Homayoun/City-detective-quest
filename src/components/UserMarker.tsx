import { Marker } from "@urbica/react-map-gl";
import detectiveLogo from "../assets/detective-logo.png";

interface UserMarkerProps {
  latitude: number;
  longitude: number;
}

export function UserMarker({ latitude, longitude }: UserMarkerProps) {
  return (
    <Marker latitude={latitude} longitude={longitude} anchor="bottom">
      <div className="user-marker" aria-label="Your location">
        <img src={detectiveLogo} alt="Detective" width="32" height="32" />
      </div>
    </Marker>
  );
}
