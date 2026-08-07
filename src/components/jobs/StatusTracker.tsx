import { Check } from "lucide-react";
import {
  STATUS_LABEL,
  STATUS_ORDER,
  type ActiveStatus,
} from "@/lib/activeJobs";
import { cn } from "@/lib/cn";

export function StatusTracker({ status }: { status: ActiveStatus }) {
  const currentIdx = STATUS_ORDER.indexOf(status);
  return (
    <ol className="flex items-center">
      {STATUS_ORDER.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full text-[12px] font-bold transition-colors",
                  done && "bg-brand-blue text-white",
                  active && "bg-navy text-white ring-4 ring-navy/10",
                  !done && !active && "bg-neutral-200 text-neutral-500"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-[11px] font-semibold",
                  active ? "text-ink" : "text-neutral-500"
                )}
              >
                {STATUS_LABEL[s]}
              </span>
            </div>
            {i < STATUS_ORDER.length - 1 && (
              <span
                className={cn(
                  "mx-1 mb-5 h-0.5 flex-1 rounded",
                  i < currentIdx ? "bg-brand-blue" : "bg-neutral-200"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
