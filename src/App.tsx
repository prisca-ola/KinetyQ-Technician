import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import JobsFeed from "@/pages/JobsFeed";
import MyJobs from "@/pages/MyJobs";
import Profile from "@/pages/Profile";

function LoginRoute() {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  if (isAuthenticated) return <Navigate to="/jobs" replace />;
  return <Login />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/jobs" element={<JobsFeed />} />
        <Route path="/my-jobs" element={<MyJobs />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/" element={<Navigate to="/jobs" replace />} />
      <Route path="*" element={<Navigate to="/jobs" replace />} />
    </Routes>
  );
}
