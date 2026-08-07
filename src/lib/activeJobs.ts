import { loadJSON, saveJSON, STORAGE_KEYS } from "./storage";
import type { AvailableJob, JobSeverity } from "./types";

// Field-service lifecycle (PRD F7).
export type ActiveStatus =
  | "accepted"
  | "en_route"
  | "arrived"
  | "in_progress"
  | "completed";

export const STATUS_ORDER: ActiveStatus[] = [
  "accepted",
  "en_route",
  "arrived",
  "in_progress",
  "completed",
];

export const STATUS_LABEL: Record<ActiveStatus, string> = {
  accepted: "Accepted",
  en_route: "En route",
  arrived: "Arrived",
  in_progress: "In progress",
  completed: "Completed",
};

// Label for the primary action that advances an active job to the next status.
export const PRIMARY_ACTION: Record<Exclude<ActiveStatus, "completed">, string> = {
  accepted: "Start travel",
  en_route: "Confirm arrival",
  arrived: "Start work",
  in_progress: "Complete job",
};

export function nextStatus(s: ActiveStatus): ActiveStatus | null {
  const i = STATUS_ORDER.indexOf(s);
  return i >= 0 && i < STATUS_ORDER.length - 1 ? STATUS_ORDER[i + 1] : null;
}

export interface ActiveJob {
  jobId: string;
  title: string;
  vehicle: string;
  location: string;
  distanceKm: number;
  skill: string;
  severity: JobSeverity;
  description: string;
  obd?: string;
  status: ActiveStatus;
  acceptedTs: number;
  history: { status: ActiveStatus; ts: number }[];
  quality?: Record<string, boolean>;
  mismatch?: { actualCost: number; actualDuration: string; reason: string };
  completionNote?: string;
  completedTs?: number;
}

export function getActive(): ActiveJob[] {
  return loadJSON<ActiveJob[]>(STORAGE_KEYS.active, []);
}

export function saveActive(list: ActiveJob[]): void {
  saveJSON(STORAGE_KEYS.active, list);
}

// Create an active job from a feed job (called when a technician accepts).
export function addActiveFromJob(job: AvailableJob): void {
  const list = getActive();
  if (list.some((a) => a.jobId === job.id)) return;
  const now = Date.now();
  list.unshift({
    jobId: job.id,
    title: job.title,
    vehicle: `${job.vehicle.year} ${job.vehicle.make} ${job.vehicle.model} · ${job.vehicle.plate}`,
    location: job.location,
    distanceKm: job.distanceKm,
    skill: job.skill,
    severity: job.severity,
    description: job.description,
    obd: job.obd,
    status: "accepted",
    acceptedTs: now,
    history: [{ status: "accepted", ts: now }],
  });
  saveActive(list);
}

// Quality checks required before a job can be completed.
export const QUALITY_CHECKS = [
  { id: "work_done", label: "Work completed as described" },
  { id: "tested", label: "Vehicle tested after repair" },
  { id: "clean", label: "Work area left clean" },
  { id: "informed", label: "Driver / customer informed" },
];
