import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TEAM_MEMBERS } from "@/lib/mockData";
import { formatNaira } from "@/lib/format";

export interface BusinessQuotePayload {
  labor: number;
  parts: number;
  other: number;
  total: number;
  timeline: string;
  assignee: string;
  note?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (p: BusinessQuotePayload) => void;
}

// Business provider detailed quote (PRD F5): cost breakdown, timeline, and a
// team member assignment so unavailable staff are not committed.
export function BusinessQuoteModal({ open, onClose, onSubmit }: Props) {
  const [labor, setLabor] = useState("");
  const [parts, setParts] = useState("");
  const [other, setOther] = useState("");
  const [timeline, setTimeline] = useState("");
  const [assignee, setAssignee] = useState("");
  const [note, setNote] = useState("");

  const total = (Number(labor) || 0) + (Number(parts) || 0) + (Number(other) || 0);
  const valid = total > 0 && !!timeline.trim() && !!assignee;

  function submit() {
    if (!valid) return;
    onSubmit({
      labor: Number(labor) || 0,
      parts: Number(parts) || 0,
      other: Number(other) || 0,
      total,
      timeline: timeline.trim(),
      assignee,
      note: note.trim() || undefined,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Submit quote"
      subtitle="Break down the cost and assign a team member."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!valid} className="min-w-[150px]">
            Submit quote
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Labour (₦)" htmlFor="labor">
            <Input
              id="labor"
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={labor}
              onChange={(e) => setLabor(e.target.value)}
            />
          </Field>
          <Field label="Parts (₦)" htmlFor="parts">
            <Input
              id="parts"
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={parts}
              onChange={(e) => setParts(e.target.value)}
            />
          </Field>
          <Field label="Other (₦)" htmlFor="other">
            <Input
              id="other"
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={other}
              onChange={(e) => setOther(e.target.value)}
            />
          </Field>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-navy px-4 py-3 text-white">
          <span className="text-[13px] font-medium text-white/70">Total quote</span>
          <span className="font-display text-xl font-bold">{formatNaira(total)}</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Timeline" htmlFor="timeline">
            <Input
              id="timeline"
              placeholder="e.g. 1 working day"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            />
          </Field>
          <Field label="Assign technician" htmlFor="assignee">
            <Select
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">Select a team member</option>
              {TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.name} disabled={!m.available}>
                  {m.name} · {m.skill}
                  {m.available ? "" : " (unavailable)"}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Notes" htmlFor="bnote" hint="Optional.">
          <Textarea
            id="bnote"
            placeholder="Scope, assumptions, or anything the customer should know."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}
