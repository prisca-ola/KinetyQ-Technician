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

// A seed for the job feed. Distances span 1.5-18km so the coverage radius is a
// meaningful filter. `createdTs` drives the "Newest" sort and the time-ago label.
const MIN = 60_000;
const now = Date.now();

export const AVAILABLE_JOBS: AvailableJob[] = [
  {
    id: "job-1044",
    title: "Battery dead - jump start",
    description:
      "Vehicle will not start. Battery appears dead. Driver needs a jump start or replacement.",
    severity: "high",
    vehicle: { make: "Nissan", model: "Navara", year: 2020, plate: "JKL 7890", type: "Pickup" },
    location: "Yaba, Lagos",
    city: "Lagos",
    distanceKm: 1.5,
    jobType: "roadside",
    skill: "Electrical systems",
    createdTs: now - 12 * MIN,
    fleetNote: "Battery replaced 6 months ago, check the alternator too.",
    attachments: [{ type: "photo", label: "Battery terminals" }],
  },
  {
    id: "job-1042",
    title: "Engine misfire detected",
    description:
      "Random / multiple cylinder misfire reported by the vehicle. Driver notes rough idle and loss of power.",
    severity: "critical",
    vehicle: { make: "Toyota", model: "Hilux", year: 2022, plate: "ABC 1234", type: "Pickup" },
    obd: "P0300 - Random/Multiple Cylinder Misfire Detected",
    location: "Ikeja, Lagos",
    city: "Lagos",
    distanceKm: 2.3,
    jobType: "workshop",
    skill: "Engine diagnostics",
    createdTs: now - 18 * MIN,
    fleetNote: "Vehicle is part of an active delivery route, treat as priority.",
    attachments: [
      { type: "photo", label: "Engine bay" },
      { type: "video", label: "Cold start" },
    ],
  },
  {
    id: "job-1043",
    title: "Brake warning light",
    description: "Left front wheel speed sensor circuit fault flagged.",
    severity: "high",
    vehicle: { make: "Mitsubishi", model: "L200", year: 2022, plate: "GHI 3456", type: "Pickup" },
    obd: "C0035 - Left Front Wheel Speed Sensor Circuit",
    location: "Surulere, Lagos",
    city: "Lagos",
    distanceKm: 3.2,
    jobType: "workshop",
    skill: "Brakes & ABS",
    createdTs: now - 42 * MIN,
  },
  {
    id: "job-1048",
    title: "Overheating on the highway",
    description: "Temperature gauge in the red. Driver has pulled over safely.",
    severity: "critical",
    vehicle: { make: "Ford", model: "Ranger", year: 2021, plate: "XYZ 5678", type: "Pickup" },
    obd: "P0217 - Engine Over Temperature Condition",
    location: "Lekki Phase 1, Lagos",
    city: "Lagos",
    distanceKm: 4.1,
    jobType: "roadside",
    skill: "Engine diagnostics",
    createdTs: now - 55 * MIN,
    attachments: [{ type: "photo", label: "Temperature gauge" }],
  },
  {
    id: "job-1045",
    title: "AC system failure",
    description: "Cabin cooling not working. No engine fault codes detected.",
    severity: "medium",
    vehicle: { make: "Isuzu", model: "D-Max", year: 2023, plate: "DEF 9012", type: "SUV" },
    location: "Victoria Island, Lagos",
    city: "Lagos",
    distanceKm: 5.8,
    jobType: "workshop",
    skill: "AC systems",
    createdTs: now - 2 * 60 * MIN,
  },
  {
    id: "job-1050",
    title: "Transmission slipping",
    description: "Gears slipping under load. Incorrect gear ratio fault present.",
    severity: "high",
    vehicle: { make: "Toyota", model: "Land Cruiser", year: 2021, plate: "MNO 2345", type: "SUV" },
    obd: "P0730 - Incorrect Gear Ratio",
    location: "Ikoyi, Lagos",
    city: "Lagos",
    distanceKm: 6.2,
    jobType: "workshop",
    skill: "Transmission",
    createdTs: now - 3 * 60 * MIN,
  },
  {
    id: "job-1051",
    title: "Flat tyre - roadside",
    description: "Tyre pressure sensor active. Driver needs a replacement or repair on site.",
    severity: "medium",
    vehicle: { make: "Honda", model: "Accord", year: 2019, plate: "PQR 6789", type: "Car" },
    location: "Ojota, Lagos",
    city: "Lagos",
    distanceKm: 9.4,
    jobType: "roadside",
    skill: "Tyres & alignment",
    createdTs: now - 4 * 60 * MIN,
  },
  {
    id: "job-1053",
    title: "Fleet van won't start",
    description: "Starter cranks but engine will not fire. No obvious fault codes.",
    severity: "high",
    vehicle: { make: "Mercedes", model: "Sprinter", year: 2020, plate: "STU 4567", type: "Van" },
    location: "Apapa, Lagos",
    city: "Lagos",
    distanceKm: 12.4,
    jobType: "mobile",
    skill: "Auto electrical",
    createdTs: now - 6 * 60 * MIN,
    fleetNote: "Part of a 6-van delivery fleet, downtime is costly.",
  },
  {
    id: "job-1055",
    title: "Suspension knock",
    description: "Knocking noise over bumps from the front left. Suspected worn control arm.",
    severity: "low",
    vehicle: { make: "Kia", model: "Sportage", year: 2018, plate: "VWX 8901", type: "SUV" },
    location: "Ikorodu, Lagos",
    city: "Lagos",
    distanceKm: 18.0,
    jobType: "workshop",
    skill: "Suspension & steering",
    createdTs: now - 8 * 60 * MIN,
  },
];

// --- Quoting (PRD F5) ---

export interface QuoteTemplate {
  label: string;
  min: number;
  max: number;
  time: string;
}

// Individual technician quick-quote presets (from the marketplace baseline).
export const QUICK_QUOTE_TEMPLATES: QuoteTemplate[] = [
  { label: "Quick fix", min: 5000, max: 15000, time: "30 min - 1 hour" },
  { label: "Minor repair", min: 15000, max: 35000, time: "1-2 hours" },
  { label: "Standard service", min: 35000, max: 75000, time: "2-4 hours" },
  { label: "Major repair", min: 75000, max: 150000, time: "Half day" },
  { label: "Full service", min: 150000, max: 300000, time: "Full day" },
];

export const CONFIDENCE_LEVELS = ["High", "Medium", "Low"] as const;

export interface TeamMember {
  id: string;
  name: string;
  skill: string;
  available: boolean;
}

// Business provider staff, used when assigning a technician to a quote.
export const TEAM_MEMBERS: TeamMember[] = [
  { id: "tm1", name: "Musa Bello", skill: "Engine & diagnostics", available: true },
  { id: "tm2", name: "Grace Eze", skill: "Electrical & AC", available: true },
  { id: "tm3", name: "Tunde Alabi", skill: "Brakes & suspension", available: false },
  { id: "tm4", name: "Ibrahim Sani", skill: "Transmission", available: true },
];

export function findJob(id: string | undefined): AvailableJob | undefined {
  return AVAILABLE_JOBS.find((j) => j.id === id);
}
