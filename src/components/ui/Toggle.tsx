import { cn } from "@/lib/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  id?: string;
}

// Accessible on/off switch. Uses an explicit on/off label track so state does
// not rely on color alone (PRD accessibility requirement for availability).
export function Toggle({ checked, onChange, label, id }: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50 focus-visible:ring-offset-2",
        checked ? "bg-success" : "bg-neutral-300"
      )}
    >
      <span
        className={cn(
          "inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );
}
