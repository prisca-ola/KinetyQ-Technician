import { useCallback, useState } from "react";
import { loadJSON, saveJSON, STORAGE_KEYS } from "@/lib/storage";

interface FeedState {
  dismissed: string[];
  accepted: string[];
}

const EMPTY: FeedState = { dismissed: [], accepted: [] };

// Tracks which jobs the technician has accepted or dismissed so they leave the
// available feed (PRD F4). Persisted so the feed stays consistent across reloads.
export function useFeedState() {
  const [state, setState] = useState<FeedState>(() =>
    loadJSON<FeedState>(STORAGE_KEYS.feed, EMPTY)
  );

  const persist = useCallback((next: FeedState) => {
    setState(next);
    saveJSON(STORAGE_KEYS.feed, next);
  }, []);

  const dismiss = useCallback(
    (id: string) =>
      persist({ ...state, dismissed: [...new Set([...state.dismissed, id])] }),
    [state, persist]
  );

  const accept = useCallback(
    (id: string) =>
      persist({ ...state, accepted: [...new Set([...state.accepted, id])] }),
    [state, persist]
  );

  const reset = useCallback(() => persist(EMPTY), [persist]);

  const isHidden = useCallback(
    (id: string) => state.dismissed.includes(id) || state.accepted.includes(id),
    [state]
  );

  return { state, dismiss, accept, reset, isHidden };
}
