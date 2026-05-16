import type { InvestigationSite } from "../types/investigationSite";

const EARTH_RADIUS = 6371000; // meters

/**
 * Calculate the distance in meters between two geographic points
 * using the Haversine formula.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c;
}

/**
 * Check if a point (lat, lng) is inside any of the given circles.
 * Returns the index of the first matching circle, or -1 if none.
 */
export function findCircleContainingPoint(
  lat: number,
  lng: number,
  circles: InvestigationSite[]
): number {
  if (!circles || circles.length === 0) return -1;

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    if (!circle || circle.lat == null || circle.lng == null) continue;

    const distance = haversineDistance(lat, lng, circle.lat, circle.lng);
    if (distance <= circle.radius) {
      return i;
    }
  }
  return -1;
}
