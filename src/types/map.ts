export type InvestigationStatus = "SOLVED" | "FAILED" | "OPEN";

export interface MapCircle {
  id: number;
  lat: number;
  lng: number;
  radius: number; // in meters
  status: InvestigationStatus;
  title: string;
}
