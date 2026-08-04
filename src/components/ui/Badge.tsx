import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import type { JobSeverity } from "@/lib/types";

type Tone = "neutral" | "blue" | "yellow" | "success" | "warning" | "danger" | "ink";

const tones: Record<Tone, string> = {
  neutral: "bg-neutral-100 text-neutral-600",
  blue: "bg-brand-blue-100 text-brand-blue-800",
  yellow: "bg-brand-yellow-100 text-[#7a5c00]",
  success: "bg-success-50 text-success",
  warning: "bg-warning-50 text-warning",
  danger: "bg-danger-50 text-danger",
  ink: "bg-ink text-white",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[11px] font-semibold leading-none",
        tones[tone],
        className
      )}
      {...rest}
    />
  );
}

const severityTone: Record<JobSeverity, Tone> = {
  critical: "danger",
  high: "warning",
  medium: "blue",
  low: "neutral",
};

export function SeverityBadge({ severity }: { severity: JobSeverity }) {
  return (
    <Badge tone={severityTone[severity]} className="uppercase tracking-wide">
      {severity}
    </Badge>
  );
}
