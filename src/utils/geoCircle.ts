import type { InvestigationSite } from "../types/investigationSite";

const EARTH_RADIUS = 6371000; // meters
const CIRCLE_SEGMENTS = 64;

/**
 * Generate a GeoJSON polygon approximating a circle on the Earth's surface.
 * The radius is geospatially accurate (in meters), not pixel-based.
 */
function createCirclePolygon(
  center: { lat: number; lng: number },
  radiusMeters: number,
  index: number
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coords: [number, number][] = [];

  for (let i = 0; i <= CIRCLE_SEGMENTS; i++) {
    const angle = (i * 2 * Math.PI) / CIRCLE_SEGMENTS;
    const latOffset = (radiusMeters / EARTH_RADIUS) * Math.cos(angle);
    const lngOffset =
      (radiusMeters / (EARTH_RADIUS * Math.cos((center.lat * Math.PI) / 180))) *
      Math.sin(angle);

    coords.push([
      center.lng + (lngOffset * 180) / Math.PI,
      center.lat + (latOffset * 180) / Math.PI,
    ]);
  }

  return {
    type: "Feature",
    properties: {
      index,
      radius: radiusMeters,
      lat: center.lat,
      lng: center.lng,
    },
    geometry: {
      type: "Polygon",
      coordinates: [coords],
    },
  };
}

/**
 * Convert an array of InvestigationSite items into a GeoJSON FeatureCollection
 * of polygon circles suitable for rendering on a map.
 */
export function circlesToGeoJSON(
  circles: InvestigationSite[]
): GeoJSON.FeatureCollection<GeoJSON.Polygon> {
  return {
    type: "FeatureCollection",
    features: circles.map((circle, index) =>
      createCirclePolygon({ lat: circle.lat, lng: circle.lng }, circle.radius, index)
    ),
  };
}

/**
 * Calculate the geographic center (average) of all circle coordinates.
 */
export function getCirclesCenter(circles: InvestigationSite[]): {
  latitude: number;
  longitude: number;
} {
  if (circles.length === 0) {
    return { latitude: 0, longitude: 0 };
  }

  const sumLat = circles.reduce((sum, c) => sum + c.lat, 0);
  const sumLng = circles.reduce((sum, c) => sum + c.lng, 0);

  return {
    latitude: sumLat / circles.length,
    longitude: sumLng / circles.length,
  };
}
