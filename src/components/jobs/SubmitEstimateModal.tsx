import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CONFIDENCE_LEVELS, QUICK_QUOTE_TEMPLATES } from "@/lib/mockData";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";

export interface EstimatePayload {
  minCost: number;
  maxCost: number;
  estTime: string;
  confidence: string;
  note?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (p: EstimatePayload) => void;
}

// Individual technician quick estimate (PRD F5): quick-quote presets + a cost
// range, estimated time, confidence, and an optional note. Laid out on an 8pt
// spacing rhythm (8 / 16 / 24).
export function SubmitEstimateModal({ open, onClose, onSubmit }: Props) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [time, setTime] = useState("");
  const [confidence, setConfidence] = useState("High");
  const [note, setNote] = useState("");
  const [template, setTemplate] = useState<string | null>(null);

  const minN = Number(min);
  const maxN = Number(max);
  const rangeValid = minN > 0 && maxN >= minN;
  const valid = rangeValid && !!time.trim();

  function applyTemplate(label: string, tMin: number, tMax: number, tTime: string) {
    setTemplate(label);
    setMin(String(tMin));
    setMax(String(tMax));
    setTime(tTime);
  }

  function submit() {
    if (!valid) return;
    onSubmit({
      minCost: minN,
      maxCost: maxN,
      estTime: time.trim(),
      confidence,
      note: note.trim() || undefined,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Submit estimate"
      subtitle="Give the customer a clear cost range and timeline."
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!valid} className="min-w-[160px]">
            Submit estimate
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quick presets */}
        <div className="space-y-3">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
            Quick presets
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUOTE_TEMPLATES.map((t) => {
              const active = template === t.label;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => applyTemplate(t.label, t.min, t.max, t.time)}
                  className={cn(
                    "rounded-xl border px-4 py-2.5 text-left transition-colors",
                    active
                      ? "border-brand-blue bg-brand-blue-50"
                      : "border-line hover:border-neutral-300"
                  )}
                >
                  <span
                    className={cn(
                      "block text-[13px] font-semibold",
                      active ? "text-brand-blue-800" : "text-ink"
                    )}
                  >
                    {t.label}
                  </span>
                  <span className="text-[12px] text-neutral-500">
                    {formatNaira(t.min)} - {formatNaira(t.max)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cost range */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Minimum cost" htmlFor="min">
            <Input
              id="min"
              type="number"
              inputMode="numeric"
              placeholder="5,000"
              leading={<span className="text-sm text-neutral-500">₦</span>}
              value={min}
              onChange={(e) => {
                setMin(e.target.value);
                setTemplate(null);
              }}
            />
          </Field>
          <Field label="Maximum cost" htmlFor="max">
            <Input
              id="max"
              type="number"
              inputMode="numeric"
              placeholder="15,000"
              leading={<span className="text-sm text-neutral-500">₦</span>}
              value={max}
              onChange={(e) => {
                setMax(e.target.value);
                setTemplate(null);
              }}
              invalid={!!max && maxN < minN}
            />
          </Field>
        </div>

        {/* Time + confidence */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Estimated time" htmlFor="time">
            <Input
              id="time"
              placeholder="e.g. 1-2 hours"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </Field>
          <Field label="Confidence" htmlFor="confidence">
            <Select
              id="confidence"
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
            >
              {CONFIDENCE_LEVELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {/* Note */}
        <Field label="Note to customer" htmlFor="note" hint="Optional.">
          <Textarea
            id="note"
            placeholder="Anything the customer should know about your estimate."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>

        {/* Live summary */}
        <div className="flex items-center justify-between rounded-xl bg-navy px-4 py-3.5 text-white">
          <span className="text-[13px] font-medium text-white/70">
            Your estimate
          </span>
          <span className="text-right">
            <span className="font-display text-lg font-bold">
              {rangeValid ? `${formatNaira(minN)} - ${formatNaira(maxN)}` : "—"}
            </span>
            {time.trim() && (
              <span className="block text-[12px] text-white/60">{time.trim()}</span>
            )}
          </span>
        </div>
      </div>
    </Modal>
  );
}
