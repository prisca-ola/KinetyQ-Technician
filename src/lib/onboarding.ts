import { loadJSON, saveJSON, removeKey } from "./storage";

// The three ways a technician enters the app:
//  - individual / business: independent sign-up (existing flow)
//  - organization: invited/deployed by a fleet-owning org (ticket: new flow)
export type OnboardingPath = "individual" | "business" | "organization";

export const SPECIALTIES = [
  "Engine diagnostics",
  "Electrical systems",
  "Brakes & ABS",
  "Transmission",
  "AC systems",
  "Suspension & steering",
  "Bodywork & paint",
  "Tyres & alignment",
  "Fleet servicing",
  "Auto electrical",
];

export interface OrgInvite {
  orgId: string;
  orgName: string;
}

// Mock invite registry. In production the org creates these from the Fleet
// Management side (ticket 5A) and they are validated server-side.
export const ORG_INVITES: Record<string, OrgInvite> = {
  "KQ-FIDELITY-2026": { orgId: "org-fidelity", orgName: "Fidelity Fleet Services" },
  "KQ-DANGOTE-2026": { orgId: "org-dangote", orgName: "Dangote Logistics" },
  "KQ-GIGM-2026": { orgId: "org-gigm", orgName: "GIG Mobility" },
};

export function resolveInvite(code: string): OrgInvite | undefined {
  return ORG_INVITES[code.trim().toUpperCase()];
}

// --- Draft persistence (PRD F2: back navigation preserves entered info) ---

export interface OnboardingDraft {
  step: number;
  // Each wizard owns its own shape; stored loosely and cast on read.
  data: unknown;
}

const draftKey = (path: OnboardingPath) => `onboarding.${path}.v1`;

export function loadDraft(path: OnboardingPath): OnboardingDraft {
  return loadJSON<OnboardingDraft>(draftKey(path), { step: 0, data: {} });
}

export function saveDraft(path: OnboardingPath, draft: OnboardingDraft): void {
  saveJSON(draftKey(path), draft);
}

export function clearDraft(path: OnboardingPath): void {
  removeKey(draftKey(path));
}

// The submitted-but-pending account, read by the verification screen.
export interface PendingAccount {
  path: OnboardingPath;
  name: string;
  email: string;
  orgName?: string;
  businessName?: string;
  submittedTs: number;
}

const PENDING_KEY = "onboarding.pending.v1";

export function setPending(p: PendingAccount): void {
  saveJSON(PENDING_KEY, p);
}

export function getPending(): PendingAccount | null {
  return loadJSON<PendingAccount | null>(PENDING_KEY, null);
}
