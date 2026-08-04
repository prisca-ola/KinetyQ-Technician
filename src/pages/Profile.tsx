import { BadgeCheck, MapPin, Star, Wrench } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Swoosh } from "@/components/brand/Swoosh";
import { useAuth } from "@/context/AuthContext";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <PageHeader eyebrow="Account" title="Profile" />

      {/* Identity header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-24 bg-ink" />
        <Swoosh variant="duo" className="absolute right-4 top-3 w-24 opacity-90" />
        <CardBody className="relative">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-4 border-surface bg-brand-blue text-2xl font-extrabold text-white shadow-card">
              {initialsOf(user.name)}
            </span>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-ink">
                  {user.name}
                </h2>
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
              <div className="text-lg font-bold text-ink">
                {user.completedJobs ?? 0}
              </div>
              <p className="text-[11px] text-neutral-500">Completed</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold text-ink">
                <MapPin className="h-4 w-4 text-neutral-500" />
                {user.coverageRadiusKm ?? 10}km
              </div>
              <p className="text-[11px] text-neutral-500">Coverage</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Specialties */}
      <Card className="mt-4">
        <CardBody>
          <div className="mb-3 flex items-center gap-2">
            <Wrench className="h-[18px] w-[18px] text-neutral-500" />
            <h3 className="text-[15px] font-bold text-ink">Specialties</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(user.specialties ?? []).map((s) => (
              <Badge key={s} tone="blue">
                {s}
              </Badge>
            ))}
          </div>
        </CardBody>
      </Card>

      <p className="mt-6 text-center text-[13px] text-neutral-500">
        Skills, certifications, and settings arrive in a later phase.
      </p>
    </div>
  );
}
