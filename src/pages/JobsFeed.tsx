import { useState } from "react";
import { MapPin, PowerOff, Route, Wrench } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { AVAILABLE_JOBS } from "@/lib/mockData";
import type { AvailableJob } from "@/lib/types";
import { cn } from "@/lib/cn";

const SORTS = ["Nearest", "Newest", "Priority"] as const;
type Sort = (typeof SORTS)[number];

function sortJobs(jobs: AvailableJob[], sort: Sort): AvailableJob[] {
  const copy = [...jobs];
  const rank = { critical: 0, high: 1, medium: 2, low: 3 } as const;
  if (sort === "Nearest") return copy.sort((a, b) => a.distanceKm - b.distanceKm);
  if (sort === "Priority") return copy.sort((a, b) => rank[a.severity] - rank[b.severity]);
  return copy; // "Newest" - seed order stands in for recency
}

function JobCard({ job }: { job: AvailableJob }) {
  const { toast } = useToast();
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-pop">
      <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={job.severity} />
            <Badge tone="neutral" className="capitalize">
              {job.jobType}
            </Badge>
            <span className="flex items-center gap-1 text-[12px] text-neutral-500">
              <MapPin className="h-3.5 w-3.5" /> {job.distanceKm} km
            </span>
          </div>
          <h3 className="truncate text-[16px] font-bold text-ink">{job.title}</h3>
          <p className="mt-0.5 text-[13px] text-neutral-500">
            {job.vehicle.year} {job.vehicle.make} {job.vehicle.model} ·{" "}
            {job.vehicle.plate}
          </p>
        </div>
        <span className="hidden shrink-0 rounded-lg bg-neutral-100 p-2 sm:block">
          <Wrench className="h-5 w-5 text-neutral-500" />
        </span>
      </div>

      <div className="border-t border-line bg-neutral-50/60 px-4 py-3 sm:px-5">
        <p className="line-clamp-2 text-[13px] text-neutral-600">
          {job.obd ? (
            <span className="font-mono text-[12px] text-ink">{job.obd}</span>
          ) : (
            job.description
          )}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-[12px] text-neutral-500">
            <Route className="h-3.5 w-3.5" /> {job.location}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast("Job detail opens in the next phase")}
            >
              View
            </Button>
            <Button
              size="sm"
              onClick={() => toast("Quote & accept ships in the next phase", "success")}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function OfflineState({ onGoOnline }: { onGoOnline: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-neutral-100">
        <PowerOff className="h-6 w-6 text-neutral-500" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-ink">You are offline</h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">
        Go online to start seeing available jobs in your coverage area. You will
        not receive new work while offline.
      </p>
      <Button className="mt-5" onClick={onGoOnline}>
        Go online
      </Button>
    </Card>
  );
}

export default function JobsFeed() {
  const { online, setOnline, user } = useAuth();
  const [sort, setSort] = useState<Sort>("Nearest");
  const jobs = sortJobs(AVAILABLE_JOBS, sort);

  return (
    <div>
      <PageHeader
        eyebrow="Marketplace"
        title="Available jobs"
        subtitle={
          online
            ? `${jobs.length} jobs in ${user?.city ?? "Lagos"} · ${user?.coverageRadiusKm ?? 10}km radius`
            : "Availability is off"
        }
        actions={
          online ? (
            <div className="flex rounded-xl border border-line bg-surface p-1">
              {SORTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors",
                    sort === s
                      ? "bg-navy text-white"
                      : "text-neutral-500 hover:text-ink"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null
        }
      />

      {online ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <OfflineState onGoOnline={() => setOnline(true)} />
      )}
    </div>
  );
}
