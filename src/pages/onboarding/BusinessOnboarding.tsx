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

const STEPS = ["Business", "Owner", "Services", "Documents", "Review"];
const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Benin City", "Enugu", "Kaduna"];
const TEAM = ["1-5", "6-15", "16-40", "40+"];
const RADII = ["10", "15", "25", "50"];

interface Data {
  businessName?: string;
  regNumber?: string;
  city?: string;
  address?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  specialties?: string[];
  teamSize?: string;
  radius?: string;
  docReg?: string;
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

export default function BusinessOnboarding() {
  const navigate = useNavigate();
  const initial = loadDraft("business");
  const [step, setStep] = useState(initial.step);
  const [data, setData] = useState<Data>(initial.data as Data);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    saveDraft("business", { step, data });
  }, [step, data]);

  const set = (patch: Partial<Data>) => setData((d) => ({ ...d, ...patch }));

  const canContinue = (() => {
    if (step === 0) return !!data.businessName?.trim();
    if (step === 1)
      return !!data.ownerName?.trim() && !!data.ownerEmail?.includes("@");
    if (step === 2) return (data.specialties?.length ?? 0) > 0;
    if (step === 3) return !!data.docReg;
    return true;
  })();

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setPending({
        path: "business",
        name: data.ownerName ?? "New business",
        email: data.ownerEmail ?? "",
        businessName: data.businessName,
        submittedTs: Date.now(),
      });
      clearDraft("business");
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
          "Business details",
          "Owner and contact",
          "Services and coverage",
          "Verification documents",
          "Review and submit",
        ][step]
      }
      subtitle={
        [
          "Tell us about your workshop or service business.",
          "The main person we should contact for this account.",
          "What your team works on and how far you cover.",
          "Upload documents so we can verify your business.",
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
          <Field label="Business name" htmlFor="businessName">
            <Input
              id="businessName"
              placeholder="e.g. SwiftFix Auto Services"
              value={data.businessName ?? ""}
              onChange={(e) => set({ businessName: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="CAC / registration no." htmlFor="regNumber">
              <Input
                id="regNumber"
                placeholder="RC 1234567"
                value={data.regNumber ?? ""}
                onChange={(e) => set({ regNumber: e.target.value })}
              />
            </Field>
            <Field label="City" htmlFor="city">
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
          <Field label="Address" htmlFor="address">
            <Input
              id="address"
              placeholder="Street address"
              value={data.address ?? ""}
              onChange={(e) => set({ address: e.target.value })}
            />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Field label="Owner / contact name" htmlFor="ownerName">
            <Input
              id="ownerName"
              placeholder="e.g. Chidi Nwosu"
              value={data.ownerName ?? ""}
              onChange={(e) => set({ ownerName: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact email" htmlFor="ownerEmail">
              <Input
                id="ownerEmail"
                type="email"
                placeholder="owner@business.com"
                value={data.ownerEmail ?? ""}
                onChange={(e) => set({ ownerEmail: e.target.value })}
              />
            </Field>
            <Field label="Contact phone" htmlFor="ownerPhone">
              <Input
                id="ownerPhone"
                placeholder="0801 234 5678"
                value={data.ownerPhone ?? ""}
                onChange={(e) => set({ ownerPhone: e.target.value })}
              />
            </Field>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <Field label="Services offered" hint="Select all that apply.">
            <ChipSelect
              options={SPECIALTIES}
              value={data.specialties ?? []}
              onChange={(v) => set({ specialties: v })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Team size" htmlFor="teamSize">
              <Select
                id="teamSize"
                value={data.teamSize ?? ""}
                onChange={(e) => set({ teamSize: e.target.value })}
              >
                <option value="">Select</option>
                {TEAM.map((x) => (
                  <option key={x} value={x}>
                    {x} technicians
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

      {step === 3 && (
        <div className="space-y-3">
          <FileUpload
            label="Business registration (CAC)"
            hint="Required. Certificate of incorporation."
            value={data.docReg}
            onChange={(name) => set({ docReg: name })}
          />
          <FileUpload
            label="Trade / service certification"
            hint="Optional. Speeds up verification."
            value={data.docCert}
            onChange={(name) => set({ docCert: name })}
          />
          <div className="mt-2 flex items-start gap-2 rounded-xl bg-brand-blue-50 px-3.5 py-3 text-[12px] text-brand-blue-800">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" />
            Your documents are encrypted and used only to verify your business.
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="divide-y divide-line">
          <ReviewRow label="Business name" value={data.businessName} />
          <ReviewRow label="Registration no." value={data.regNumber} />
          <ReviewRow label="City" value={data.city} />
          <ReviewRow label="Address" value={data.address} />
          <ReviewRow label="Owner / contact" value={data.ownerName} />
          <ReviewRow label="Contact email" value={data.ownerEmail} />
          <ReviewRow label="Contact phone" value={data.ownerPhone} />
          <ReviewRow label="Services" value={data.specialties?.join(", ")} />
          <ReviewRow label="Team size" value={data.teamSize} />
          <ReviewRow
            label="Coverage radius"
            value={data.radius ? `${data.radius} km` : undefined}
          />
          <ReviewRow label="Registration doc" value={data.docReg} />
          <ReviewRow label="Certification" value={data.docCert} />
        </div>
      )}
    </OnboardingLayout>
  );
}
