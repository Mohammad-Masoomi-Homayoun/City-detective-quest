export type InvestigationStatus = "SOLVED" | "FAILED" | "OPEN";

export interface MapCircle {
  lat: number;
  lng: number;
  radius: number; // in meters
  status: InvestigationStatus;
}
