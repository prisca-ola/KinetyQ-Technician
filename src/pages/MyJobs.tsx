import { useState } from "react";
import { ClipboardList, FileText, History } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/cn";

const TABS = [
  { key: "active", label: "Active", icon: ClipboardList },
  { key: "quoted", label: "Quoted", icon: FileText },
  { key: "history", label: "History", icon: History },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const EMPTY: Record<TabKey, { title: string; body: string }> = {
  active: {
    title: "No active jobs yet",
    body: "Jobs you accept will appear here so you can move them from en route to completed.",
  },
  quoted: {
    title: "No quotes submitted",
    body: "Estimates you send will show here with their pending, accepted, or rejected status.",
  },
  history: {
    title: "No completed jobs in this period",
    body: "Your finished work and customer feedback will be collected here.",
  },
};

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold text-ink">{value}</p>
    </Card>
  );
}

export default function MyJobs() {
  const { user } = useAuth();
  const [tab, setTab] = useState<TabKey>("active");
  const empty = EMPTY[tab];
  const Icon = TABS.find((t) => t.key === tab)!.icon;

  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="My jobs"
        subtitle="Track active work, submitted quotes, and completed history."
      />

      <div className="mb-5 grid grid-cols-3 gap-3">
        <Stat label="Active" value={0} />
        <Stat label="Quoted" value={0} />
        <Stat label="Completed" value={user?.completedJobs ?? 0} />
      </div>

      <div className="mb-4 flex gap-1 rounded-xl border border-line bg-surface p-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors",
              tab === key ? "bg-ink text-white" : "text-neutral-500 hover:text-ink"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-neutral-100">
          <Icon className="h-6 w-6 text-neutral-500" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-ink">{empty.title}</h3>
        <p className="mt-1 max-w-sm text-sm text-neutral-500">{empty.body}</p>
      </Card>
    </div>
  );
}
