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

interface AuthContextValue {
  user: TechnicianAccount | null;
  isAuthenticated: boolean;
  ready: boolean;
  online: boolean;
  setOnline: (v: boolean) => void;
  login: (email: string, key: string) => LoginResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function resolveUser(session: Session | null): TechnicianAccount | null {
  if (!session) return null;
  return DEMO_ACCOUNTS.find((a) => a.id === session.userId) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TechnicianAccount | null>(null);
  const [ready, setReady] = useState(false);
  const [online, setOnlineState] = useState(false);

  // Restore a prototype session on boot.
  useEffect(() => {
    const session = loadJSON<Session | null>(STORAGE_KEYS.session, null);
    setUser(resolveUser(session));
    setOnlineState(loadJSON<boolean>(STORAGE_KEYS.online, false));
    setReady(true);
  }, []);

  const login = useCallback((email: string, key: string): LoginResult => {
    const account = findAccountByEmail(email);
    if (!account || key !== DEMO_KEY) {
      return { ok: false, error: "Incorrect email or access key." };
    }
    const session: Session = { userId: account.id, ts: Date.now() };
    saveJSON(STORAGE_KEYS.session, session);
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

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      ready,
      online,
      setOnline,
      login,
      logout,
    }),
    [user, ready, online, setOnline, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
