import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, TechnicianAccount } from "@/lib/types";
import { DEMO_ACCOUNTS, DEMO_KEY, findAccountByEmail } from "@/lib/mockData";
import { loadJSON, removeKey, saveJSON, STORAGE_KEYS } from "@/lib/storage";

interface LoginResult {
  ok: boolean;
  error?: string;
}

export interface Coverage {
  city: string;
  radiusKm: number;
}

interface AuthContextValue {
  user: TechnicianAccount | null;
  isAuthenticated: boolean;
  ready: boolean;
  online: boolean;
  setOnline: (v: boolean) => void;
  coverage: Coverage;
  setCoverage: (c: Coverage) => void;
  login: (email: string, key: string) => LoginResult;
  logout: () => void;
}

const DEFAULT_COVERAGE: Coverage = { city: "Lagos", radiusKm: 10 };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function resolveUser(session: Session | null): TechnicianAccount | null {
  if (!session) return null;
  return DEMO_ACCOUNTS.find((a) => a.id === session.userId) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TechnicianAccount | null>(null);
  const [ready, setReady] = useState(false);
  const [online, setOnlineState] = useState(false);
  const [coverage, setCoverageState] = useState<Coverage>(DEFAULT_COVERAGE);

  // Restore a prototype session on boot.
  useEffect(() => {
    const session = loadJSON<Session | null>(STORAGE_KEYS.session, null);
    const restored = resolveUser(session);
    setUser(restored);
    setOnlineState(loadJSON<boolean>(STORAGE_KEYS.online, false));
    setCoverageState(
      loadJSON<Coverage>(STORAGE_KEYS.coverage, {
        city: restored?.city ?? DEFAULT_COVERAGE.city,
        radiusKm: restored?.coverageRadiusKm ?? DEFAULT_COVERAGE.radiusKm,
      })
    );
    setReady(true);
  }, []);

  const login = useCallback((email: string, key: string): LoginResult => {
    const account = findAccountByEmail(email);
    if (!account || key !== DEMO_KEY) {
      return { ok: false, error: "Incorrect email or access key." };
    }
    const session: Session = { userId: account.id, ts: Date.now() };
    saveJSON(STORAGE_KEYS.session, session);
    const cov: Coverage = {
      city: account.city ?? DEFAULT_COVERAGE.city,
      radiusKm: account.coverageRadiusKm ?? DEFAULT_COVERAGE.radiusKm,
    };
    saveJSON(STORAGE_KEYS.coverage, cov);
    setCoverageState(cov);
    setUser(account);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    removeKey(STORAGE_KEYS.session);
    setUser(null);
    setOnlineState(false);
    saveJSON(STORAGE_KEYS.online, false);
  }, []);

  const setOnline = useCallback((v: boolean) => {
    setOnlineState(v);
    saveJSON(STORAGE_KEYS.online, v);
  }, []);

  const setCoverage = useCallback((c: Coverage) => {
    setCoverageState(c);
    saveJSON(STORAGE_KEYS.coverage, c);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      ready,
      online,
      setOnline,
      coverage,
      setCoverage,
      login,
      logout,
    }),
    [user, ready, online, setOnline, coverage, setCoverage, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
