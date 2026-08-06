import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  ClipboardList,
  LogOut,
  MapPin,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/cn";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/my-jobs", label: "My Jobs", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: UserIcon },
];

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function AvailabilityControl() {
  const { online, setOnline, coverage } = useAuth();
  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col items-end leading-tight">
        <span
          className={cn(
            "text-[13px] font-semibold",
            online ? "text-success" : "text-neutral-500"
          )}
        >
          {online ? "Online" : "Offline"}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-neutral-500">
          <MapPin className="h-3 w-3" />
          {coverage.city} · {coverage.radiusKm}km
        </span>
      </div>
      <Toggle checked={online} onChange={setOnline} label="Toggle availability" />
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-neutral-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-blue text-[12px] font-bold text-white">
          {initialsOf(user.name)}
        </span>
        <span className="hidden md:block text-[13px] font-semibold text-ink">
          {user.name.split(" ")[0]}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-surface shadow-pop animate-fade-in z-50"
        >
          <div className="p-3 border-b border-line">
            <p className="text-sm font-semibold text-ink">{user.name}</p>
            <p className="text-[12px] text-neutral-500">{user.email}</p>
            <span className="mt-2 inline-flex items-center h-5 rounded-full bg-neutral-100 px-2 text-[11px] font-semibold capitalize text-neutral-600">
              {user.accountType} · {user.affiliation}
            </span>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium text-ink hover:bg-neutral-50"
          >
            <LogOut className="h-4 w-4 text-neutral-500" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-navy text-white">
      <div className="flex h-[60px] items-center px-6">
        <Logo className="h-6 text-white" />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
          Workspace
        </p>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "grid place-items-center h-5 w-5",
                    isActive ? "text-brand-yellow" : ""
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-3">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-[13px] font-semibold text-white">{user?.name}</p>
          <p className="text-[11px] text-white/50 capitalize">
            {user?.businessName ?? `${user?.accountType} technician`}
          </p>
        </div>
      </div>
    </aside>
  );
}

function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-surface/95 backdrop-blur pb-safe">
      <div className="grid grid-cols-3">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold",
                isActive ? "text-brand-blue" : "text-neutral-500"
              )
            }
          >
            <Icon className="h-[22px] w-[22px]" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function AppShell() {
  const location = useLocation();
  // Scroll to top on route change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr] bg-canvas">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6">
          <div className="lg:hidden">
            <Logo className="h-5 text-ink" />
          </div>
          <div className="hidden lg:block text-sm font-semibold text-neutral-500">
            Technician workspace
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <AvailabilityControl />
            <div className="h-6 w-px bg-line" />
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
