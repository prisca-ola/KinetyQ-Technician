import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ClipboardList,
  FileText,
  History,
  TriangleAlert,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { useActiveJobs } from "@/hooks/useActiveJobs";
import { getQuotes, type QuoteRecord } from "@/lib/quotes";
import { STATUS_LABEL, type ActiveJob } from "@/lib/activeJobs";
import { PERFORMANCE } from "@/lib/profileStore";
import { TEAM_MEMBERS } from "@/lib/mockData";
import { formatNaira, timeAgo } from "@/lib/format";
import { cn } from "@/lib/cn";

const TABS = [
  { key: "active", label: "Active", icon: ClipboardList },
  { key: "quoted", label: "Quoted", icon: FileText },
  { key: "history", label: "History", icon: History },
] as const;
type TabKey = (typeof TABS)[number]["key"];

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card className="p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold text-ink">{value}</p>
      {sub && <p className="text-[11px] text-neutral-500">{sub}</p>}
    </Card>
  );
}

function EmptyState({ icon: Icon, title, body }: { icon: typeof ClipboardList; title: string; body: string }) {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-neutral-100">
        <Icon className="h-6 w-6 text-neutral-500" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">{body}</p>
    </Card>
  );
}

function ActiveRow({ job }: { job: ActiveJob }) {
  return (
    <Link to={`/active/${job.jobId}`}>
      <Card className="p-4 transition-shadow hover:shadow-pop">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge tone="ink">{STATUS_LABEL[job.status]}</Badge>
              <Badge tone="blue">{job.skill}</Badge>
            </div>
            <h4 className="truncate text-[15px] font-bold text-ink">{job.title}</h4>
            <p className="truncate text-[13px] text-neutral-500">{job.vehicle}</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300" />
        </div>
      </Card>
    </Link>
  );
}

function QuoteRow({ q }: { q: QuoteRecord }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate text-[15px] font-bold text-ink">{q.jobTitle}</h4>
          <p className="truncate text-[13px] text-neutral-500">{q.vehicle}</p>
        </div>
        <Badge tone="warning">Pending</Badge>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-neutral-600">
        {q.path === "individual" ? (
          <>
            <span className="font-semibold text-ink">
              {formatNaira(q.minCost ?? 0)} - {formatNaira(q.maxCost ?? 0)}
            </span>
            <span>{q.estTime}</span>
            <span className="text-neutral-500">Confidence: {q.confidence}</span>
          </>
        ) : (
          <>
            <span className="font-semibold text-ink">{formatNaira(q.total ?? 0)}</span>
            <span>{q.timeline}</span>
            <span className="text-neutral-500">Assigned: {q.assignee}</span>
          </>
        )}
        <span className="ml-auto text-[12px] text-neutral-400">{timeAgo(q.ts)}</span>
      </div>
    </Card>
  );
}

function HistoryRow({ job }: { job: ActiveJob }) {
  return (
    <Link to={`/active/${job.jobId}`}>
      <Card className="p-4 transition-shadow hover:shadow-pop">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge tone="success">Completed</Badge>
              {job.mismatch && (
                <Badge tone="warning">
                  <TriangleAlert className="h-3 w-3" /> Mismatch
                </Badge>
              )}
            </div>
            <h4 className="truncate text-[15px] font-bold text-ink">{job.title}</h4>
            <p className="truncate text-[13px] text-neutral-500">{job.vehicle}</p>
          </div>
          <span className="shrink-0 text-[12px] text-neutral-400">
            {job.completedTs ? timeAgo(job.completedTs) : ""}
          </span>
        </div>
      </Card>
    </Link>
  );
}

function TeamWorkload() {
  const available = TEAM_MEMBERS.filter((m) => m.available).length;
  return (
    <Card>
      <CardBody>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-[18px] w-[18px] text-neutral-500" />
            <h3 className="text-[15px] font-bold text-ink">Team workload</h3>
          </div>
          <Badge tone="blue">
            {available} of {TEAM_MEMBERS.length} available
          </Badge>
        </div>
        <div className="space-y-2">
          {TEAM_MEMBERS.map((m) => (
            <div key={m.id} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  m.available ? "bg-success" : "bg-neutral-300"
                )}
              />
              <span className="text-[14px] font-medium text-ink">{m.name}</span>
              <span className="text-[12px] text-neutral-500">{m.skill}</span>
              <span className="ml-auto text-[12px] font-medium text-neutral-500">
                {m.available ? "Available" : "Busy"}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default function MyJobs() {
  const { user } = useAuth();
  const { jobs } = useActiveJobs();
  const quotes = useMemo(() => getQuotes(), []);
  const [tab, setTab] = useState<TabKey>("active");

  const active = jobs.filter((j) => j.status !== "completed");
  const history = jobs.filter((j) => j.status === "completed");
  const isBusiness = user?.accountType === "business";
  const perf = PERFORMANCE.weekly;

  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="My jobs"
        subtitle="Track active work, submitted quotes, and completed history."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Active" value={active.length} />
        <Stat label="Quoted" value={quotes.length} sub="Pending review" />
        <Stat label="Completed" value={history.length} />
        <Stat label="On-time" value={`${perf.onTimePct}%`} sub="This week" />
      </div>

      {isBusiness && (
        <div className="mb-5">
          <TeamWorkload />
        </div>
      )}

      <div className="mb-4 flex gap-1 rounded-xl border border-line bg-surface p-1">
        {TABS.map(({ key, label }) => {
          const count =
            key === "active" ? active.length : key === "quoted" ? quotes.length : history.length;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors",
                tab === key ? "bg-navy text-white" : "text-neutral-500 hover:text-ink"
              )}
            >
              {label}
              {count > 0 && (
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-[11px]",
                    tab === key ? "bg-white/20" : "bg-neutral-100 text-neutral-500"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "active" &&
        (active.length ? (
          <div className="space-y-3">
            {active.map((j) => (
              <ActiveRow key={j.jobId} job={j} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="No active jobs yet"
            body="Accept a job from the marketplace and it will appear here to work through."
          />
        ))}

      {tab === "quoted" &&
        (quotes.length ? (
          <div className="space-y-3">
            {quotes.map((q) => (
              <QuoteRow key={q.id} q={q} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No quotes submitted"
            body="Estimates you send from a job will show here with their status."
          />
        ))}

      {tab === "history" &&
        (history.length ? (
          <div className="space-y-3">
            {history.map((j) => (
              <HistoryRow key={j.jobId} job={j} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={History}
            title="No completed jobs yet"
            body="Jobs you finish will be collected here with their completion details."
          />
        ))}
    </div>
  );
}
