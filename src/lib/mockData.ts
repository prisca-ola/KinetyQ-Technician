import type { AvailableJob, TechnicianAccount } from "./types";

// Prototype auth: shared demo access key across seeded accounts.
// Production auth replaces this per PRD (Feature 1 open question).
export const DEMO_KEY = "kine2026";

export const DEMO_ACCOUNTS: TechnicianAccount[] = [
  {
    id: "tech-ind-001",
    email: "tech@kinetyq.com",
    name: "Emeka Obi",
    accountType: "individual",
    affiliation: "independent",
    verification: "verified",
    rating: 4.8,
    completedJobs: 214,
    city: "Lagos",
    coverageRadiusKm: 10,
    specialties: ["Electrical systems", "Diagnostics", "Brakes"],
  },
  {
    id: "tech-biz-001",
    email: "business@kinetyq.com",
    name: "Chidi Nwosu",
    accountType: "business",
    affiliation: "independent",
    businessName: "SwiftFix Auto Services",
    verification: "verified",
    rating: 4.9,
    completedJobs: 1320,
    city: "Lagos",
    coverageRadiusKm: 25,
    specialties: ["Fleet servicing", "Transmission", "AC systems"],
  },
];

export function findAccountByEmail(email: string): TechnicianAccount | undefined {
  const e = email.trim().toLowerCase();
  return DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === e);
}

// A small seed for the job feed. The full feed (sorting, filtering, evidence,
// quoting) is built out in a later phase - this exists so the shell is navigable.
export const AVAILABLE_JOBS: AvailableJob[] = [
  {
    id: "job-1042",
    title: "Engine misfire detected",
    description:
      "Random / multiple cylinder misfire reported by the vehicle. Driver notes rough idle and loss of power.",
    severity: "critical",
    vehicle: { make: "Toyota", model: "Hilux", year: 2022, plate: "ABC 1234" },
    obd: "P0300 - Random/Multiple Cylinder Misfire Detected",
    location: "Ikeja, Lagos",
    distanceKm: 2.3,
    jobType: "workshop",
    skill: "Engine diagnostics",
    createdAgo: "18 min ago",
    fleetNote: "Vehicle is part of an active delivery route, treat as priority.",
  },
  {
    id: "job-1043",
    title: "Brake warning light",
    description: "Left front wheel speed sensor circuit fault flagged.",
    severity: "high",
    vehicle: { make: "Mitsubishi", model: "L200", year: 2022, plate: "GHI 3456" },
    obd: "C0035 - Left Front Wheel Speed Sensor Circuit",
    location: "Surulere, Lagos",
    distanceKm: 3.2,
    jobType: "workshop",
    skill: "Brakes & ABS",
    createdAgo: "42 min ago",
  },
  {
    id: "job-1044",
    title: "Battery dead - jump start",
    description:
      "Vehicle will not start. Battery appears dead. Driver needs a jump start or replacement.",
    severity: "high",
    vehicle: { make: "Nissan", model: "Navara", year: 2020, plate: "JKL 7890" },
    obd: undefined,
    location: "Yaba, Lagos",
    distanceKm: 1.5,
    jobType: "roadside",
    skill: "Electrical systems",
    createdAgo: "1 hour ago",
    fleetNote: "Battery replaced 6 months ago, check the alternator too.",
  },
  {
    id: "job-1045",
    title: "AC system failure",
    description: "Cabin cooling not working. No engine fault codes detected.",
    severity: "medium",
    vehicle: { make: "Isuzu", model: "D-Max", year: 2023, plate: "DEF 9012" },
    obd: undefined,
    location: "Victoria Island, Lagos",
    distanceKm: 5.8,
    jobType: "workshop",
    skill: "AC systems",
    createdAgo: "2 hours ago",
  },
];
