import type { Puzzle } from "./puzzle";
import type { InvestigationSite } from "./investigationSite";

export interface Quest {
  id: number;
  puzzle: Puzzle;
  investigationSite: InvestigationSite;
}
