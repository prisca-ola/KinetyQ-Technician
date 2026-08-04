// KinetyQ Technician - core domain types.
// Kept intentionally forward-looking so later phases (org-deployed technicians,
// work orders, quoting, execution) extend these rather than redefining them.

export type AccountType = "individual" | "business";

// How a technician relates to the platform:
//  - independent: signed up on their own (existing marketplace flow)
//  - organization: invited/deployed by a fleet-owning org (ticket: new flow)
export type Affiliation = "independent" | "organization";

export type VerificationStatus = "verified" | "pending" | "rejected";

export interface TechnicianAccount {
  id: string;
  email: string;
  name: string;
  accountType: AccountType;
  affiliation: Affiliation;
  /** set when affiliation === "organization" */
  organizationId?: string;
  organizationName?: string;
  /** set when accountType === "business" */
  businessName?: string;
  verification: VerificationStatus;
  rating?: number;
  completedJobs?: number;
  city?: string;
  coverageRadiusKm?: number;
  specialties?: string[];
}

export interface Session {
  userId: string;
  ts: number;
}

// --- Jobs (foundation for the feed built out in a later phase) ---

export type JobSeverity = "critical" | "high" | "medium" | "low";
export type JobType = "roadside" | "workshop" | "mobile";

export interface JobVehicle {
  make: string;
  model: string;
  year: number;
  plate: string;
}

export interface AvailableJob {
  id: string;
  title: string;
  description: string;
  severity: JobSeverity;
  vehicle: JobVehicle;
  obd?: string;
  location: string;
  distanceKm: number;
  jobType: JobType;
  skill: string;
  createdAgo: string;
  fleetNote?: string;
}
