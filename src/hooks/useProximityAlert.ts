import { useEffect, useRef, useState } from "react";
import type { GeoLocation } from "./useGeolocation";
import type { InvestigationSite } from "../types/investigationSite";
import { findCircleContainingPoint } from "../utils/distance";

interface ProximityAlertResult {
  insideCircleIndex: number;
  showNotification: boolean;
  dismissNotification: () => void;
}

export function useProximityAlert(
  location: GeoLocation,
  circles: InvestigationSite[]
): ProximityAlertResult {
  const [insideCircleIndex, setInsideCircleIndex] = useState(-1);
  const [showNotification, setShowNotification] = useState(false);
  const lastAlertedIndex = useRef(-1);

  useEffect(() => {
    const index = findCircleContainingPoint(
      location.latitude,
      location.longitude,
      circles
    );

    setInsideCircleIndex(index);

    // Only alert when entering a new circle (not repeatedly)
    if (index !== -1 && index !== lastAlertedIndex.current) {
      lastAlertedIndex.current = index;
      setShowNotification(true);

      // Vibrate on mobile (if supported)
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    } else if (index === -1) {
      lastAlertedIndex.current = -1;
    }
  }, [location, circles]);

  const dismissNotification = () => {
    setShowNotification(false);
  };

  return { insideCircleIndex, showNotification, dismissNotification };
}
