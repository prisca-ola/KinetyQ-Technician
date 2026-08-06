import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface ChipSelectProps {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}

// Multi-select chip group (used for specialties). Toggles values in/out.
export function ChipSelect({ options, value, onChange }: ChipSelectProps) {
  function toggle(opt: string) {
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
              active
                ? "border-brand-blue bg-brand-blue-50 text-brand-blue-800"
                : "border-line bg-surface text-neutral-600 hover:border-neutral-300"
            )}
          >
            {active && <Check className="h-3.5 w-3.5" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}
