import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";

export interface MismatchPayload {
  actualCost: number;
  actualDuration: string;
  reason: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (p: MismatchPayload) => void;
}

// Report that actual work differed from the quoted estimate (PRD F7).
export function EstimateMismatchModal({ open, onClose, onSubmit }: Props) {
  const [cost, setCost] = useState("");
  const [duration, setDuration] = useState("");
  const [reason, setReason] = useState("");

  const valid = Number(cost) > 0 && !!duration.trim() && reason.trim().length >= 10;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Report estimate mismatch"
      subtitle="Record what the job actually took versus the estimate."
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSubmit({
                actualCost: Number(cost),
                actualDuration: duration.trim(),
                reason: reason.trim(),
              })
            }
            disabled={!valid}
          >
            Submit report
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Actual cost" htmlFor="acost">
            <Input
              id="acost"
              type="number"
              inputMode="numeric"
              placeholder="0"
              leading={<span className="text-sm text-neutral-500">₦</span>}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </Field>
          <Field label="Actual duration" htmlFor="adur">
            <Input
              id="adur"
              placeholder="e.g. 3 hours"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Field>
        </div>
        <Field label="What changed?" htmlFor="reason" hint="At least 10 characters.">
          <Textarea
            id="reason"
            placeholder="Explain why the cost or time differed from the estimate."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}
