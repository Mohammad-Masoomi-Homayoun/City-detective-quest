import { apiGet } from "./client";
import type { Quest } from "../types/quest";

export async function fetchQuests(): Promise<Quest[]> {
  return apiGet<Quest[]>("/quest");
}
