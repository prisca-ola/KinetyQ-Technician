import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import JobsFeed from "@/pages/JobsFeed";
import JobDetail from "@/pages/JobDetail";
import MyJobs from "@/pages/MyJobs";
import ActiveJobDetail from "@/pages/ActiveJobDetail";
import Profile from "@/pages/Profile";
import Join from "@/pages/onboarding/Join";
import IndividualOnboarding from "@/pages/onboarding/IndividualOnboarding";
import BusinessOnboarding from "@/pages/onboarding/BusinessOnboarding";
import OrganizationOnboarding from "@/pages/onboarding/OrganizationOnboarding";
import VerificationPending from "@/pages/onboarding/VerificationPending";

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

      {/* Onboarding (public - a new technician is not signed in yet) */}
      <Route path="/join" element={<Join />} />
      <Route path="/onboarding/individual" element={<IndividualOnboarding />} />
      <Route path="/onboarding/business" element={<BusinessOnboarding />} />
      <Route path="/onboarding/organization" element={<OrganizationOnboarding />} />
      <Route path="/verification-pending" element={<VerificationPending />} />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/jobs" element={<JobsFeed />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/my-jobs" element={<MyJobs />} />
        <Route path="/active/:id" element={<ActiveJobDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/" element={<Navigate to="/jobs" replace />} />
      <Route path="*" element={<Navigate to="/jobs" replace />} />
    </Routes>
  );
}
