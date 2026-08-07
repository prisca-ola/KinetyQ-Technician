import { useState } from "react";
import { Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea, Field } from "@/components/ui/Input";
import { QUALITY_CHECKS } from "@/lib/activeJobs";
import { cn } from "@/lib/cn";

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete: (checks: Record<string, boolean>, note?: string) => void;
}

// Quality checklist gate before completion (PRD F7): all checks required.
export function QualityChecklistModal({ open, onClose, onComplete }: Props) {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState("");

  const allChecked = QUALITY_CHECKS.every((c) => checks[c.id]);
  const missing = QUALITY_CHECKS.filter((c) => !checks[c.id]).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Complete job"
      subtitle="Confirm the quality checks before you close this job."
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] text-neutral-500">
            {allChecked ? "All checks complete" : `${missing} check${missing > 1 ? "s" : ""} left`}
          </span>
          <Button onClick={() => onComplete(checks, note.trim() || undefined)} disabled={!allChecked}>
            Mark completed
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {QUALITY_CHECKS.map((c) => {
            const on = !!checks[c.id];
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setChecks((p) => ({ ...p, [c.id]: !on }))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  on ? "border-success/40 bg-success-50" : "border-line hover:border-neutral-300"
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors",
                    on ? "border-success bg-success text-white" : "border-neutral-300"
                  )}
                >
                  {on && <Check className="h-4 w-4" />}
                </span>
                <span className="text-[14px] font-medium text-ink">{c.label}</span>
              </button>
            );
          })}
        </div>

        <Field label="Completion note" hint="Optional." htmlFor="cnote">
          <Textarea
            id="cnote"
            placeholder="Summary of the work done."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}
