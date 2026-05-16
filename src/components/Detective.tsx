import { Marker } from "@urbica/react-map-gl";
import detectiveLogo from "../assets/detective-logo.png";

interface DetectiveProps {
  latitude: number;
  longitude: number;
}

/* Detective component */
export function Detective({ latitude, longitude }: DetectiveProps) {
  return (
    <Marker latitude={latitude} longitude={longitude} anchor="bottom">
      <div className="detective-marker" aria-label="Your location">
        <img src={detectiveLogo} alt="Detective" width="26" height="26" />
      </div>
    </Marker>
  );
}
