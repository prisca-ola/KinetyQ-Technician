import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, Info } from "lucide-react";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { WizardActions } from "@/components/onboarding/WizardActions";
import { Field, Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  clearDraft,
  loadDraft,
  resolveInvite,
  saveDraft,
  setPending,
} from "@/lib/onboarding";

const STEPS = ["Invite code", "Your details", "Confirm"];
const ROLES = ["Technician", "Senior technician", "Workshop lead"];

interface Data {
  code?: string;
  orgId?: string;
  orgName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-[13px] text-neutral-500">{label}</span>
      <span className="text-right text-[14px] font-medium text-ink">
        {value || "—"}
      </span>
    </div>
  );
}

export default function OrganizationOnboarding() {
  const navigate = useNavigate();
  const initial = loadDraft("organization");
  const [step, setStep] = useState(initial.step);
  const [data, setData] = useState<Data>(initial.data as Data);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    saveDraft("organization", { step, data });
  }, [step, data]);

  const set = (patch: Partial<Data>) => setData((d) => ({ ...d, ...patch }));

  const invite = data.code ? resolveInvite(data.code) : undefined;

  const canContinue = (() => {
    if (step === 0) return !!invite;
    if (step === 1) return !!data.fullName?.trim() && !!data.email?.includes("@");
    return true;
  })();

  function next() {
    if (step === 0 && invite) {
      // Lock in the resolved org before advancing.
      set({ orgId: invite.orgId, orgName: invite.orgName });
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setPending({
        path: "organization",
        name: data.fullName ?? "New technician",
        email: data.email ?? "",
        orgName: data.orgName ?? invite?.orgName,
        submittedTs: Date.now(),
      });
      clearDraft("organization");
      navigate("/verification-pending", { replace: true });
    }, 500);
  }

  const back = step === 0 ? () => navigate("/join") : () => setStep(step - 1);

  return (
    <OnboardingLayout
      steps={STEPS}
      current={step}
      title={
        ["Enter your invite code", "Your details", "Confirm and join"][step]
      }
      subtitle={
        [
          "Your organization sent you a code or link to join under their account.",
          "Tell us who you are. Your organization already manages your fleet work.",
          "You are joining under your organization's KinetyQ account.",
        ][step]
      }
      footer={
        <WizardActions
          onBack={back}
          backLabel={step === 0 ? "Back to options" : "Back"}
          onNext={next}
          nextLabel={step === STEPS.length - 1 ? "Join organization" : "Continue"}
          nextDisabled={!canContinue}
          busy={busy}
        />
      }
    >
      {step === 0 && (
        <div className="space-y-4">
          <Field label="Invite code" htmlFor="code">
            <Input
              id="code"
              placeholder="e.g. KQ-FIDELITY-2026"
              value={data.code ?? ""}
              onChange={(e) => set({ code: e.target.value })}
              className="uppercase"
              invalid={!!data.code && !invite}
            />
          </Field>

          {invite ? (
            <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success-50 px-3.5 py-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white">
                <Building2 className="h-5 w-5 text-brand-blue" />
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {invite.orgName}
                </p>
                <p className="text-[12px] text-neutral-500">
                  You will join under this organization.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl bg-neutral-50 px-3.5 py-3 text-[12px] text-neutral-500">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
              <span>
                Demo codes: <span className="font-semibold text-ink">KQ-FIDELITY-2026</span>,{" "}
                <span className="font-semibold text-ink">KQ-DANGOTE-2026</span>,{" "}
                <span className="font-semibold text-ink">KQ-GIGM-2026</span>
              </span>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="mb-1 flex items-center gap-2 rounded-xl bg-brand-blue-50 px-3.5 py-2.5 text-[13px] font-medium text-brand-blue-800">
            <Building2 className="h-4 w-4" />
            Joining {data.orgName ?? invite?.orgName}
          </div>
          <Field label="Full name" htmlFor="fullName">
            <Input
              id="fullName"
              placeholder="e.g. Emeka Obi"
              value={data.fullName ?? ""}
              onChange={(e) => set({ fullName: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Work email" htmlFor="email">
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={data.email ?? ""}
                onChange={(e) => set({ email: e.target.value })}
              />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Input
                id="phone"
                placeholder="0801 234 5678"
                value={data.phone ?? ""}
                onChange={(e) => set({ phone: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Role" htmlFor="role">
            <Select
              id="role"
              value={data.role ?? ""}
              onChange={(e) => set({ role: e.target.value })}
            >
              <option value="">Select your role</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-line bg-neutral-50 p-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-blue-50 text-brand-blue">
              <Building2 className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">
                {data.orgName ?? invite?.orgName}
              </p>
              <p className="text-[12px] text-neutral-500">
                You will operate under this organization's account.
              </p>
            </div>
          </div>
          <div className="divide-y divide-line">
            <ReviewRow label="Full name" value={data.fullName} />
            <ReviewRow label="Work email" value={data.email} />
            <ReviewRow label="Phone" value={data.phone} />
            <ReviewRow label="Role" value={data.role} />
          </div>
        </div>
      )}
    </OnboardingLayout>
  );
}
