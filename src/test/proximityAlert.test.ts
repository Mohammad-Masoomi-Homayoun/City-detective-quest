import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProximityAlert } from "../hooks/useProximityAlert";
import { haversineDistance, findCircleContainingPoint } from "../utils/distance";
import type { MapCircle } from "../types/map";
import type { GeoLocation } from "../hooks/useGeolocation";

// ─── Distance utility tests ───────────────────────────────────────────────────

describe("haversineDistance", () => {
  it("returns 0 for the same point", () => {
    const d = haversineDistance(51.4327, 5.4399, 51.4327, 5.4399);
    expect(d).toBeCloseTo(0, 0);
  });

  it("calculates correct distance between two known points", () => {
    // Eindhoven to Amsterdam is roughly 120km
    const d = haversineDistance(51.4416, 5.4697, 52.3676, 4.9041);
    expect(d).toBeGreaterThan(100000);
    expect(d).toBeLessThan(130000);
  });

  it("calculates short distances accurately", () => {
    // ~50m offset from a point
    const lat = 51.432742;
    const lng = 5.439947;
    // Move ~50m north (approx 0.00045 degrees latitude)
    const d = haversineDistance(lat, lng, lat + 0.00045, lng);
    expect(d).toBeGreaterThan(40);
    expect(d).toBeLessThan(60);
  });
});

// ─── findCircleContainingPoint tests ──────────────────────────────────────────

describe("findCircleContainingPoint", () => {
  const circles: MapCircle[] = [
    { lat: 51.432742, lng: 5.439947, radius: 50, status: "OPEN", title: "Test Site 1", id: 1 },
    { lat: 52.3676, lng: 4.9041, radius: 1200, status: "OPEN", title: "Test Site 2", id: 2 },
  ];

  it("returns index when point is inside a circle", () => {
    // Exact center of first circle
    const result = findCircleContainingPoint(51.432742, 5.439947, circles);
    expect(result).toBe(0);
  });

  it("returns index when point is near the edge but still inside", () => {
    // ~30m from center of first circle (radius is 50m)
    const result = findCircleContainingPoint(51.43274 + 0.00027, 5.439947, circles);
    expect(result).toBe(0);
  });

  it("returns -1 when point is outside all circles", () => {
    // Far away from any circle
    const result = findCircleContainingPoint(48.0, 2.0, circles);
    expect(result).toBe(-1);
  });

  it("returns -1 when point is just outside the radius", () => {
    // ~60m from center of first circle (radius is 50m)
    const result = findCircleContainingPoint(51.432742 + 0.00055, 5.439947, circles);
    expect(result).toBe(-1);
  });

  it("returns the first matching circle index", () => {
    // Point inside second circle
    const result = findCircleContainingPoint(52.3676, 4.9041, circles);
    expect(result).toBe(1);
  });
});

// ─── useProximityAlert hook tests ─────────────────────────────────────────────

describe("useProximityAlert", () => {
  const circles: MapCircle[] = [
    { lat: 51.432742, lng: 5.439947, radius: 50, status: "OPEN", title: "Test Site", id: 1 },
  ];

  beforeEach(() => {
    // Mock navigator.vibrate
    Object.defineProperty(navigator, "vibrate", {
      value: vi.fn(),
      writable: true,
      configurable: true,
    });
  });

  it("shows notification when user is inside a circle", () => {
    const insideLocation: GeoLocation = {
      latitude: 51.432742,
      longitude: 5.439947,
    };

    const { result } = renderHook(() =>
      useProximityAlert(insideLocation, circles)
    );

    expect(result.current.insideCircleIndex).toBe(0);
    expect(result.current.showNotification).toBe(true);
  });

  it("triggers vibration when user enters a circle", () => {
    const insideLocation: GeoLocation = {
      latitude: 51.432742,
      longitude: 5.439947,
    };

    renderHook(() => useProximityAlert(insideLocation, circles));

    expect(navigator.vibrate).toHaveBeenCalledWith([200, 100, 200]);
  });

  it("does not show notification when user is outside all circles", () => {
    const outsideLocation: GeoLocation = {
      latitude: 48.0,
      longitude: 2.0,
    };

    const { result } = renderHook(() =>
      useProximityAlert(outsideLocation, circles)
    );

    expect(result.current.insideCircleIndex).toBe(-1);
    expect(result.current.showNotification).toBe(false);
  });

  it("does not vibrate when user is outside all circles", () => {
    const outsideLocation: GeoLocation = {
      latitude: 48.0,
      longitude: 2.0,
    };

    renderHook(() => useProximityAlert(outsideLocation, circles));

    expect(navigator.vibrate).not.toHaveBeenCalled();
  });

  it("dismisses notification when dismissNotification is called", () => {
    const insideLocation: GeoLocation = {
      latitude: 51.432742,
      longitude: 5.439947,
    };

    const { result } = renderHook(() =>
      useProximityAlert(insideLocation, circles)
    );

    expect(result.current.showNotification).toBe(true);

    act(() => {
      result.current.dismissNotification();
    });

    expect(result.current.showNotification).toBe(false);
  });

  it("does not re-trigger notification for the same circle", () => {
    const insideLocation: GeoLocation = {
      latitude: 51.432742,
      longitude: 5.439947,
    };

    const { result, rerender } = renderHook(
      ({ location }) => useProximityAlert(location, circles),
      { initialProps: { location: insideLocation } }
    );

    // Dismiss notification
    act(() => {
      result.current.dismissNotification();
    });

    // Re-render with same location (still inside)
    rerender({ location: { ...insideLocation } });

    // Should not re-show notification for same circle
    expect(result.current.showNotification).toBe(false);
  });

  it("re-triggers notification after leaving and re-entering a circle", () => {
    const insideLocation: GeoLocation = {
      latitude: 51.432742,
      longitude: 5.439947,
    };
    const outsideLocation: GeoLocation = {
      latitude: 48.0,
      longitude: 2.0,
    };

    const { result, rerender } = renderHook(
      ({ location }) => useProximityAlert(location, circles),
      { initialProps: { location: insideLocation } }
    );

    expect(result.current.showNotification).toBe(true);

    // Leave the circle
    rerender({ location: outsideLocation });
    expect(result.current.insideCircleIndex).toBe(-1);

    // Re-enter the circle
    rerender({ location: insideLocation });
    expect(result.current.showNotification).toBe(true);
    expect(navigator.vibrate).toHaveBeenCalledTimes(2);
  });
});
