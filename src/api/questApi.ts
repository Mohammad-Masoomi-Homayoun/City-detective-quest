import { apiGet } from "./client";
import type { Quest } from "../types/quest";

export interface QuestResponse {
  _id: string;
  puzzle: Quest["puzzle"];
  investigationSite: Quest["investigationSite"];
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchQuests(): Promise<QuestResponse[]> {
  return apiGet<QuestResponse[]>("/quest");
}
