import { loadJSON, saveJSON, STORAGE_KEYS } from "./storage";

// Editable profile capabilities (PRD F8). Specialties seed from the account on
// first load; skills and tools are added by the technician.
export interface ProfileData {
  specialties: string[];
  skills: string[];
  tools: string[];
}

export function loadProfile(seedSpecialties: string[] = []): ProfileData {
  const stored = loadJSON<ProfileData | null>(STORAGE_KEYS.profile, null);
  if (stored) return stored;
  return { specialties: seedSpecialties, skills: [], tools: [] };
}

export function saveProfile(p: ProfileData): void {
  saveJSON(STORAGE_KEYS.profile, p);
}

// Mocked performance by period. Production computes these from real events.
export type PerfPeriod = "weekly" | "monthly";
export interface PerfMetrics {
  completed: number;
  onTimePct: number;
  acceptancePct: number;
  earnings: number;
}

export const PERFORMANCE: Record<PerfPeriod, PerfMetrics> = {
  weekly: { completed: 6, onTimePct: 96, acceptancePct: 82, earnings: 184000 },
  monthly: { completed: 27, onTimePct: 94, acceptancePct: 78, earnings: 812000 },
};
