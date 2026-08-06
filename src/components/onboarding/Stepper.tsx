import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface StepperProps {
  steps: string[];
  current: number; // 0-based index of the active step
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold transition-colors",
                  done && "bg-brand-blue text-white",
                  active && "bg-navy text-white",
                  !done && !active && "bg-neutral-200 text-neutral-500"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-[13px] font-semibold sm:block",
                  active ? "text-ink" : "text-neutral-500"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "h-px flex-1 rounded",
                  done ? "bg-brand-blue" : "bg-neutral-200"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
