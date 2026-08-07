import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  ChevronRight,
  MapPin,
  Plus,
  Settings,
  ShieldCheck,
  Star,
  Wrench,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ChipSelect } from "@/components/ui/ChipSelect";
import { Swoosh } from "@/components/brand/Swoosh";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { SPECIALTIES } from "@/lib/onboarding";
import {
  loadProfile,
  saveProfile,
  PERFORMANCE,
  type PerfPeriod,
  type ProfileData,
} from "@/lib/profileStore";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";

function initialsOf(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function RemovableChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-50 py-1.5 pl-3 pr-2 text-[13px] font-medium text-brand-blue-800">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="grid h-5 w-5 place-items-center rounded-full text-brand-blue-800/60 hover:bg-white hover:text-brand-blue-800"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function InlineAdd({ placeholder, onAdd }: { placeholder: string; onAdd: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  function submit() {
    const v = value.trim();
    if (v) onAdd(v);
    setValue("");
    setOpen(false);
  }
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-neutral-300 px-3 py-1.5 text-[13px] font-medium text-neutral-500 hover:border-brand-blue hover:text-brand-blue"
      >
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    );
  }
  return (
    <div className="flex w-full items-center gap-2">
      <Input
        autoFocus
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className="h-9"
      />
      <Button size="sm" onClick={submit}>
        Add
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </div>
  );
}

function CapabilityCard({
  title,
  items,
  onRemove,
  action,
}: {
  title: string;
  items: string[];
  onRemove?: (v: string) => void;
  action: React.ReactNode;
}) {
  return (
    <Card>
      <CardBody>
        <div className="mb-3 flex items-center gap-2">
          <Wrench className="h-[18px] w-[18px] text-neutral-500" />
          <h3 className="text-[15px] font-bold text-ink">{title}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {items.length === 0 && (
            <span className="text-[13px] text-neutral-400">None added yet</span>
          )}
          {items.map((s) =>
            onRemove ? (
              <RemovableChip key={s} label={s} onRemove={() => onRemove(s)} />
            ) : (
              <Badge key={s} tone="blue">
                {s}
              </Badge>
            )
          )}
          {action}
        </div>
      </CardBody>
    </Card>
  );
}

export default function Profile() {
  const { user, coverage } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfileState] = useState<ProfileData>(() =>
    loadProfile(user?.specialties ?? [])
  );
  const [period, setPeriod] = useState<PerfPeriod>("weekly");
  const [specModal, setSpecModal] = useState(false);
  const [tempSpec, setTempSpec] = useState<string[]>([]);

  if (!user) return null;
  const perf = PERFORMANCE[period];

  function update(patch: Partial<ProfileData>) {
    const next = { ...profile, ...patch };
    setProfileState(next);
    saveProfile(next);
  }

  return (
    <div>
      <PageHeader eyebrow="Account" title="Profile" />

      {/* Identity */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-24 bg-navy" />
        <Swoosh variant="duo" className="absolute right-4 top-3 w-24 opacity-90" />
        <CardBody className="relative">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-4 border-surface bg-brand-blue text-2xl font-extrabold text-white shadow-card">
              {initialsOf(user.name)}
            </span>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-ink">{user.name}</h2>
                {user.verification === "verified" && (
                  <BadgeCheck className="h-5 w-5 text-brand-blue" />
                )}
              </div>
              <p className="text-sm text-neutral-500">
                {user.businessName ?? `${user.accountType} technician`}
                {" · "}
                <span className="capitalize">{user.affiliation}</span>
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-neutral-50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-ink">
                <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
                {user.rating ?? "—"}
              </div>
              <p className="text-[11px] text-neutral-500">Rating</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 text-center">
              <div className="text-lg font-bold text-ink">{user.completedJobs ?? 0}</div>
              <p className="text-[11px] text-neutral-500">Completed</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-ink">
                <MapPin className="h-4 w-4 text-neutral-500" />
                {coverage.radiusKm}km
              </div>
              <p className="text-[11px] text-neutral-500">{coverage.city}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Performance */}
      <Card className="mt-4">
        <CardBody>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-ink">Performance</h3>
            <div className="flex rounded-lg border border-line bg-surface p-0.5">
              {(["weekly", "monthly"] as PerfPeriod[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "rounded-md px-3 py-1 text-[12px] font-semibold capitalize transition-colors",
                    period === p ? "bg-navy text-white" : "text-neutral-500 hover:text-ink"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <PerfCell label="Completed" value={perf.completed} />
            <PerfCell label="On-time" value={`${perf.onTimePct}%`} />
            <PerfCell label="Acceptance" value={`${perf.acceptancePct}%`} />
            <PerfCell label="Earnings" value={formatNaira(perf.earnings)} />
          </div>
        </CardBody>
      </Card>

      {/* Specialties */}
      <div className="mt-4">
        <CapabilityCard
          title="Specialties"
          items={profile.specialties}
          action={
            <button
              onClick={() => {
                setTempSpec(profile.specialties);
                setSpecModal(true);
              }}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-neutral-300 px-3 py-1.5 text-[13px] font-medium text-neutral-500 hover:border-brand-blue hover:text-brand-blue"
            >
              <Plus className="h-3.5 w-3.5" /> Edit
            </button>
          }
        />
      </div>

      {/* Skills */}
      <div className="mt-4">
        <CapabilityCard
          title="Skills"
          items={profile.skills}
          onRemove={(v) => update({ skills: profile.skills.filter((s) => s !== v) })}
          action={
            <InlineAdd
              placeholder="e.g. Hybrid systems"
              onAdd={(v) =>
                !profile.skills.includes(v) && update({ skills: [...profile.skills, v] })
              }
            />
          }
        />
      </div>

      {/* Tools */}
      <div className="mt-4">
        <CapabilityCard
          title="Tools"
          items={profile.tools}
          onRemove={(v) => update({ tools: profile.tools.filter((t) => t !== v) })}
          action={
            <InlineAdd
              placeholder="e.g. OBD-II scanner"
              onAdd={(v) =>
                !profile.tools.includes(v) && update({ tools: [...profile.tools, v] })
              }
            />
          }
        />
      </div>

      {/* Entry points */}
      <div className="mt-4 space-y-2">
        <EntryRow
          icon={ShieldCheck}
          label="Certifications & documents"
          onClick={() => toast("Certifications arrives in the next feature")}
        />
        <EntryRow
          icon={Settings}
          label="Settings"
          onClick={() => toast("Settings arrives in the next feature")}
        />
      </div>

      <Modal
        open={specModal}
        onClose={() => setSpecModal(false)}
        title="Edit specialties"
        subtitle="Select everything you work on."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setSpecModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                update({ specialties: tempSpec });
                setSpecModal(false);
                toast("Specialties updated", "success");
              }}
            >
              Save
            </Button>
          </div>
        }
      >
        <ChipSelect options={SPECIALTIES} value={tempSpec} onChange={setTempSpec} />
      </Modal>

      <p className="mt-6 text-center text-[13px] text-neutral-500">
        Certifications and settings arrive in the next features.
      </p>
    </div>
  );
}

function PerfCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-neutral-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-0.5 font-display text-lg font-bold text-ink">{value}</p>
    </div>
  );
}

function EntryRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Settings;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-card transition-colors hover:border-brand-blue"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neutral-100">
        <Icon className="h-5 w-5 text-neutral-500" />
      </span>
      <span className="flex-1 text-[15px] font-semibold text-ink">{label}</span>
      <ChevronRight className="h-5 w-5 text-neutral-300" />
    </button>
  );
}
