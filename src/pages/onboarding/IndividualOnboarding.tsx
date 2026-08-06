import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { WizardActions } from "@/components/onboarding/WizardActions";
import { Field, Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ChipSelect } from "@/components/ui/ChipSelect";
import { FileUpload } from "@/components/ui/FileUpload";
import {
  SPECIALTIES,
  clearDraft,
  loadDraft,
  saveDraft,
  setPending,
} from "@/lib/onboarding";

const STEPS = ["Personal", "Professional", "Documents", "Review"];
const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Benin City", "Enugu", "Kaduna"];
const EXPERIENCE = ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"];
const RADII = ["5", "10", "15", "25"];

interface Data {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  specialties?: string[];
  experience?: string;
  radius?: string;
  docId?: string;
  docCert?: string;
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

export default function IndividualOnboarding() {
  const navigate = useNavigate();
  const initial = loadDraft("individual");
  const [step, setStep] = useState(initial.step);
  const [data, setData] = useState<Data>(initial.data as Data);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    saveDraft("individual", { step, data });
  }, [step, data]);

  const set = (patch: Partial<Data>) => setData((d) => ({ ...d, ...patch }));

  const canContinue = (() => {
    if (step === 0)
      return !!data.fullName?.trim() && !!data.email?.includes("@");
    if (step === 1) return (data.specialties?.length ?? 0) > 0;
    if (step === 2) return !!data.docId;
    return true;
  })();

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    // Final submit
    setBusy(true);
    setTimeout(() => {
      setPending({
        path: "individual",
        name: data.fullName ?? "New technician",
        email: data.email ?? "",
        submittedTs: Date.now(),
      });
      clearDraft("individual");
      navigate("/verification-pending", { replace: true });
    }, 500);
  }

  const back = step === 0 ? () => navigate("/join") : () => setStep(step - 1);

  return (
    <OnboardingLayout
      steps={STEPS}
      current={step}
      title={
        [
          "Your details",
          "Your expertise",
          "Verification documents",
          "Review and submit",
        ][step]
      }
      subtitle={
        [
          "Tell us who you are. This appears on your technician profile.",
          "What you work on and where. This helps match you to the right jobs.",
          "Upload documents so we can verify your account.",
          "Check everything looks right before you submit.",
        ][step]
      }
      footer={
        <WizardActions
          onBack={back}
          backLabel={step === 0 ? "Back to options" : "Back"}
          onNext={next}
          nextLabel={step === STEPS.length - 1 ? "Submit application" : "Continue"}
          nextDisabled={!canContinue}
          busy={busy}
        />
      }
    >
      {step === 0 && (
        <div className="space-y-4">
          <Field label="Full name" htmlFor="fullName">
            <Input
              id="fullName"
              placeholder="e.g. Emeka Obi"
              value={data.fullName ?? ""}
              onChange={(e) => set({ fullName: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                placeholder="you@email.com"
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
          <Field label="Base city" htmlFor="city">
            <Select
              id="city"
              value={data.city ?? ""}
              onChange={(e) => set({ city: e.target.value })}
            >
              <option value="">Select a city</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <Field label="Specialties" hint="Select all that apply.">
            <ChipSelect
              options={SPECIALTIES}
              value={data.specialties ?? []}
              onChange={(v) => set({ specialties: v })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Experience" htmlFor="experience">
              <Select
                id="experience"
                value={data.experience ?? ""}
                onChange={(e) => set({ experience: e.target.value })}
              >
                <option value="">Select</option>
                {EXPERIENCE.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Coverage radius (km)" htmlFor="radius">
              <Select
                id="radius"
                value={data.radius ?? ""}
                onChange={(e) => set({ radius: e.target.value })}
              >
                <option value="">Select</option>
                {RADII.map((r) => (
                  <option key={r} value={r}>
                    {r} km
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <FileUpload
            label="Government ID"
            hint="Required. NIN, driver's licence, or passport."
            value={data.docId}
            onChange={(name) => set({ docId: name })}
          />
          <FileUpload
            label="Trade certificate"
            hint="Optional. Speeds up verification."
            value={data.docCert}
            onChange={(name) => set({ docCert: name })}
          />
          <div className="mt-2 flex items-start gap-2 rounded-xl bg-brand-blue-50 px-3.5 py-3 text-[12px] text-brand-blue-800">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" />
            Your documents are encrypted and used only to verify your account.
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="divide-y divide-line">
          <ReviewRow label="Full name" value={data.fullName} />
          <ReviewRow label="Email" value={data.email} />
          <ReviewRow label="Phone" value={data.phone} />
          <ReviewRow label="Base city" value={data.city} />
          <ReviewRow label="Specialties" value={data.specialties?.join(", ")} />
          <ReviewRow label="Experience" value={data.experience} />
          <ReviewRow
            label="Coverage radius"
            value={data.radius ? `${data.radius} km` : undefined}
          />
          <ReviewRow label="Government ID" value={data.docId} />
          <ReviewRow label="Trade certificate" value={data.docCert} />
        </div>
      )}
    </OnboardingLayout>
  );
}
