import type { Puzzle } from "./puzzle";
import type { InvestigationSite } from "./investigationSite";

export interface Quest {
  _id?: string;
  title: string;
  description: string;
  puzzle: Puzzle;
  investigationSite: InvestigationSite;
}
