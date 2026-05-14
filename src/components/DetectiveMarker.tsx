import { Marker } from "@urbica/react-map-gl";
import detectiveLogo from "../assets/detective-logo.png";

interface DetectiveMarkerProps {
  latitude: number;
  longitude: number;
}

export function DetectiveMarker({ latitude, longitude }: DetectiveMarkerProps) {
  return (
    <Marker latitude={latitude} longitude={longitude} anchor="bottom">
      <div className="detective-marker" aria-label="Your location">
        <img src={detectiveLogo} alt="Detective" width="26" height="26" />
      </div>
    </Marker>
  );
}
