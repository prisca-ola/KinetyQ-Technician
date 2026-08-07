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
// range, estimated time, confidence, and an optional note.
export function SubmitEstimateModal({ open, onClose, onSubmit }: Props) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [time, setTime] = useState("");
  const [confidence, setConfidence] = useState("High");
  const [note, setNote] = useState("");
  const [template, setTemplate] = useState<string | null>(null);

  const minN = Number(min);
  const maxN = Number(max);
  const valid = minN > 0 && maxN >= minN && !!time.trim();

  function applyTemplate(label: string, tMin: number, tMax: number, tTime: string) {
    setTemplate(label);
    setMin(String(tMin));
    setMax(String(tMax));
    setTime(tTime);
  }

  function submit() {
    if (!valid) return;
    onSubmit({ minCost: minN, maxCost: maxN, estTime: time.trim(), confidence, note: note.trim() || undefined });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Submit estimate"
      subtitle="Give the customer a clear cost range and timeline."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!valid} className="min-w-[150px]">
            Submit estimate
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-[12px] font-semibold text-neutral-500">
            Quick presets
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUOTE_TEMPLATES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => applyTemplate(t.label, t.min, t.max, t.time)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-[12px] transition-colors",
                  template === t.label
                    ? "border-brand-blue bg-brand-blue-50 text-brand-blue-800"
                    : "border-line hover:border-neutral-300"
                )}
              >
                <span className="block font-semibold">{t.label}</span>
                <span className="text-neutral-500">
                  {formatNaira(t.min)} - {formatNaira(t.max)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Min cost (₦)" htmlFor="min">
            <Input
              id="min"
              type="number"
              inputMode="numeric"
              placeholder="5000"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
          </Field>
          <Field label="Max cost (₦)" htmlFor="max">
            <Input
              id="max"
              type="number"
              inputMode="numeric"
              placeholder="15000"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              invalid={!!max && maxN < minN}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
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

        <Field label="Note to customer" htmlFor="note" hint="Optional.">
          <Textarea
            id="note"
            placeholder="Anything the customer should know about your estimate."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}
