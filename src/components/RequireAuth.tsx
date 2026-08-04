import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

// Route guard: only authenticated technicians reach protected routes. While the
// session is being restored we render nothing (avoids a login flash on reload).
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();

  if (!ready) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
