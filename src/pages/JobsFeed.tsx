import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  PowerOff,
  RefreshCw,
  Route,
  SearchX,
  SlidersHorizontal,
  Wrench,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { useFeedState } from "@/hooks/useFeedState";
import { AVAILABLE_JOBS } from "@/lib/mockData";
import { SPECIALTIES } from "@/lib/onboarding";
import { timeAgo } from "@/lib/format";
import type {
  AvailableJob,
  JobSeverity,
  JobType,
  VehicleType,
} from "@/lib/types";
import { cn } from "@/lib/cn";

const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"];
const RADII = [5, 10, 15, 25, 50];
const SORTS = ["Nearest", "Newest", "Priority"] as const;
type Sort = (typeof SORTS)[number];

interface Filters {
  jobType: JobType | "all";
  vehicleType: VehicleType | "all";
  severity: JobSeverity | "all";
  skill: string | "all";
}
const NO_FILTERS: Filters = {
  jobType: "all",
  vehicleType: "all",
  severity: "all",
  skill: "all",
};

const SEVERITY_RANK: Record<JobSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function sortJobs(jobs: AvailableJob[], sort: Sort): AvailableJob[] {
  const copy = [...jobs];
  if (sort === "Nearest") return copy.sort((a, b) => a.distanceKm - b.distanceKm);
  if (sort === "Priority")
    return copy.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
  return copy.sort((a, b) => b.createdTs - a.createdTs); // Newest
}

function activeFilterCount(f: Filters): number {
  return Object.values(f).filter((v) => v !== "all").length;
}

function JobCard({
  job,
  onView,
  onAccept,
  onDismiss,
}: {
  job: AvailableJob;
  onView: () => void;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-pop">
      <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={job.severity} />
            <Badge tone="neutral" className="capitalize">
              {job.jobType}
            </Badge>
            <Badge tone="blue">{job.skill}</Badge>
          </div>
          <h3 className="truncate text-[16px] font-bold text-ink">{job.title}</h3>
          <p className="mt-0.5 text-[13px] text-neutral-500">
            {job.vehicle.year} {job.vehicle.make} {job.vehicle.model} ·{" "}
            {job.vehicle.plate}
          </p>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss job"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="border-t border-line bg-neutral-50/60 px-4 py-3 sm:px-5">
        <p className="line-clamp-2 text-[13px] text-neutral-600">
          {job.obd ? (
            <span className="font-mono text-[12px] text-ink">{job.obd}</span>
          ) : (
            job.description
          )}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-3 text-[12px] text-neutral-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.distanceKm} km
            </span>
            <span className="flex items-center gap-1">
              <Route className="h-3.5 w-3.5" /> {job.location}
            </span>
            <span className="hidden sm:inline">{timeAgo(job.createdTs)}</span>
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onView}>
              View
            </Button>
            <Button size="sm" onClick={onAccept}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EmptyCard({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: typeof PowerOff;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-neutral-100">
        <Icon className="h-6 w-6 text-neutral-500" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

export default function JobsFeed() {
  const { online, setOnline, coverage, setCoverage } = useAuth();
  const { state, accept, dismiss, reset } = useFeedState();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [sort, setSort] = useState<Sort>("Nearest");
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const hiddenIds = useMemo(
    () => new Set([...state.dismissed, ...state.accepted, ...state.quoted]),
    [state]
  );

  const inCity = useMemo(
    () => AVAILABLE_JOBS.filter((j) => j.city === coverage.city),
    [coverage.city]
  );
  const inRadius = useMemo(
    () => inCity.filter((j) => j.distanceKm <= coverage.radiusKm),
    [inCity, coverage.radiusKm]
  );

  const visible = useMemo(() => {
    const list = inRadius.filter((j) => {
      if (hiddenIds.has(j.id)) return false;
      if (filters.jobType !== "all" && j.jobType !== filters.jobType) return false;
      if (filters.vehicleType !== "all" && j.vehicle.type !== filters.vehicleType)
        return false;
      if (filters.severity !== "all" && j.severity !== filters.severity) return false;
      if (filters.skill !== "all" && j.skill !== filters.skill) return false;
      return true;
    });
    return sortJobs(list, sort);
  }, [inRadius, hiddenIds, filters, sort]);

  const hiddenInScope = inRadius.filter((j) => hiddenIds.has(j.id)).length;
  const filterCount = activeFilterCount(filters);

  function refresh() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast("Feed updated", "success");
    }, 700);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Marketplace"
        title="Available jobs"
        subtitle={
          online
            ? `${visible.length} of ${inRadius.length} jobs in range`
            : "Availability is off"
        }
        actions={
          online ? (
            <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing}>
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              Refresh
            </Button>
          ) : null
        }
      />

      {online && (
        <>
          {/* Coverage + sort + filters toolbar */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-2.5 py-1.5">
              <MapPin className="h-4 w-4 text-brand-blue" />
              <span className="text-[13px] font-medium text-neutral-500">Within</span>
              <select
                value={coverage.radiusKm}
                onChange={(e) =>
                  setCoverage({ ...coverage, radiusKm: Number(e.target.value) })
                }
                className="cursor-pointer appearance-none bg-transparent text-[13px] font-semibold text-ink focus:outline-none"
              >
                {RADII.map((r) => (
                  <option key={r} value={r}>
                    {r} km
                  </option>
                ))}
              </select>
              <span className="text-[13px] font-medium text-neutral-500">of</span>
              <select
                value={coverage.city}
                onChange={(e) => setCoverage({ ...coverage, city: e.target.value })}
                className="cursor-pointer appearance-none bg-transparent text-[13px] font-semibold text-ink focus:outline-none"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="flex rounded-xl border border-line bg-surface p-1">
                {SORTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSort(s)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors",
                      sort === s ? "bg-navy text-white" : "text-neutral-500 hover:text-ink"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Button
                variant={showFilters || filterCount ? "primary" : "outline"}
                size="sm"
                onClick={() => setShowFilters((v) => !v)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {filterCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/25 px-1 text-[11px] font-bold">
                    {filterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Collapsible advanced filters */}
          {showFilters && (
            <Card className="mb-4 p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="space-y-1.5">
                  <span className="text-[12px] font-semibold text-neutral-500">Job type</span>
                  <Select
                    value={filters.jobType}
                    onChange={(e) =>
                      setFilters({ ...filters, jobType: e.target.value as Filters["jobType"] })
                    }
                  >
                    <option value="all">All types</option>
                    <option value="roadside">Roadside</option>
                    <option value="workshop">Workshop</option>
                    <option value="mobile">Mobile</option>
                  </Select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-[12px] font-semibold text-neutral-500">Vehicle</span>
                  <Select
                    value={filters.vehicleType}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        vehicleType: e.target.value as Filters["vehicleType"],
                      })
                    }
                  >
                    <option value="all">All vehicles</option>
                    {["Car", "Pickup", "SUV", "Truck", "Van"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-[12px] font-semibold text-neutral-500">Urgency</span>
                  <Select
                    value={filters.severity}
                    onChange={(e) =>
                      setFilters({ ...filters, severity: e.target.value as Filters["severity"] })
                    }
                  >
                    <option value="all">Any urgency</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-[12px] font-semibold text-neutral-500">Specialization</span>
                  <Select
                    value={filters.skill}
                    onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
                  >
                    <option value="all">All specialties</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </label>
              </div>
              {filterCount > 0 && (
                <button
                  onClick={() => setFilters(NO_FILTERS)}
                  className="mt-3 text-[13px] font-semibold text-brand-blue hover:underline"
                >
                  Clear filters
                </button>
              )}
            </Card>
          )}

          {hiddenInScope > 0 && (
            <div className="mb-3 flex items-center gap-2 text-[12px] text-neutral-500">
              {hiddenInScope} hidden ·{" "}
              <button onClick={reset} className="font-semibold text-brand-blue hover:underline">
                Reset feed
              </button>
            </div>
          )}
        </>
      )}

      {/* Body */}
      {!online ? (
        <EmptyCard
          icon={PowerOff}
          title="You are offline"
          body="Go online to start seeing available jobs in your coverage area. You will not receive new work while offline."
          action={<Button onClick={() => setOnline(true)}>Go online</Button>}
        />
      ) : inCity.length === 0 ? (
        <EmptyCard
          icon={MapPin}
          title={`No jobs in ${coverage.city}`}
          body="There is no available work in this city right now. Try a different coverage city."
        />
      ) : inRadius.length === 0 ? (
        <EmptyCard
          icon={Route}
          title="No jobs within your radius"
          body={`Nothing within ${coverage.radiusKm} km. Widen your coverage radius to see more work.`}
          action={
            <Button variant="outline" onClick={() => setCoverage({ ...coverage, radiusKm: 50 })}>
              Widen to 50 km
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        filterCount > 0 ? (
          <EmptyCard
            icon={SearchX}
            title="No jobs match your filters"
            body="Try removing a filter to see more available work."
            action={
              <Button variant="outline" onClick={() => setFilters(NO_FILTERS)}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyCard
            icon={Wrench}
            title="You have cleared the feed"
            body="You have actioned every job in range. Reset to see them again, or widen your coverage."
            action={<Button variant="outline" onClick={reset}>Reset feed</Button>}
          />
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={() => navigate(`/jobs/${job.id}`)}
              onAccept={() => {
                accept(job.id);
                toast("Job accepted. Find it in My Jobs.", "success");
              }}
              onDismiss={() => {
                dismiss(job.id);
                toast("Job dismissed");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
