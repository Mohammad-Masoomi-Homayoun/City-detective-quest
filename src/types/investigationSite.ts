export type InvestigationStatus = "SOLVED" | "FAILED" | "OPEN";

export interface InvestigationSite {
  id: number;
  lat: number;
  lng: number;
  radius: number; // in meters
  status: InvestigationStatus;
  title: string;
}
