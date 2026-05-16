import { useState, useEffect, useCallback } from "react";
import { fetchQuests, type QuestResponse } from "../api/questApi";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

interface UseQuestsResult {
  quests: QuestResponse[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useQuests(): UseQuestsResult {
  const [quests, setQuests] = useState<QuestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const loadQuests = useCallback(async () => {
    setLoading(true);
    setError(null);

    for (let i = 0; i <= MAX_RETRIES; i++) {
      try {
        const data = await fetchQuests();
        setQuests(data);
        setLoading(false);
        return;
      } catch (err) {
        if (i < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        } else {
          setError((err as Error).message);
          setLoading(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    loadQuests();
  }, [loadQuests, attempt]);

  const retry = useCallback(() => {
    setAttempt((prev) => prev + 1);
  }, []);

  return { quests, loading, error, retry };
}
