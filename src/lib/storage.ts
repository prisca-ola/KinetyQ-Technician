// Namespaced, crash-safe localStorage helpers. All persisted app state uses the
// `kinetyq.tech.*` namespace so it never collides with anything else on the origin.

const NS = "kinetyq.tech.";

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    // storage full / unavailable - ignore at this prototype stage
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(NS + key);
  } catch {
    /* ignore */
  }
}

export const STORAGE_KEYS = {
  session: "session.v1",
  online: "availability.online.v1",
  coverage: "availability.coverage.v1",
  feed: "feed.state.v1",
} as const;
