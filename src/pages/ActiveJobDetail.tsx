import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Route,
  TriangleAlert,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useActiveJobs } from "@/hooks/useActiveJobs";
import { StatusTracker } from "@/components/jobs/StatusTracker";
import { QualityChecklistModal } from "@/components/jobs/QualityChecklistModal";
import {
  EstimateMismatchModal,
  type MismatchPayload,
} from "@/components/jobs/EstimateMismatchModal";
import {
  PRIMARY_ACTION,
  STATUS_LABEL,
  nextStatus,
  type ActiveStatus,
} from "@/lib/activeJobs";
import { formatNaira, timeAgo } from "@/lib/format";

export default function ActiveJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { byId, advance, update } = useActiveJobs();
  const { toast } = useToast();
  const [qualityOpen, setQualityOpen] = useState(false);
  const [mismatchOpen, setMismatchOpen] = useState(false);

  const job = byId(id ?? "");

  if (!job) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Job not found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          This active job is no longer available.
        </p>
        <Link to="/my-jobs" className="mt-5 inline-block">
          <Button>Back to My Jobs</Button>
        </Link>
      </div>
    );
  }

  const completed = job.status === "completed";
  const primaryLabel =
    job.status !== "completed" ? PRIMARY_ACTION[job.status] : "";

  function onPrimary() {
    if (job!.status === "in_progress") {
      setQualityOpen(true);
    } else {
      advance(job!.jobId);
      toast(`Marked ${STATUS_LABEL[nextOf(job!.status)]}`, "success");
    }
  }

  function completeJob(quality: Record<string, boolean>, note?: string) {
    update(job!.jobId, {
      status: "completed",
      quality,
      completionNote: note,
      completedTs: Date.now(),
      history: [...job!.history, { status: "completed", ts: Date.now() }],
    });
    setQualityOpen(false);
    toast("Job completed", "success");
    navigate("/my-jobs");
  }

  function submitMismatch(p: MismatchPayload) {
    update(job!.jobId, { mismatch: p });
    setMismatchOpen(false);
    toast("Estimate mismatch recorded");
  }

  return (
    <div>
      <Link
        to="/my-jobs"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-500 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Jobs
      </Link>

      <div className="mb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge tone={completed ? "success" : "ink"}>
            {STATUS_LABEL[job.status]}
          </Badge>
          <SeverityBadge severity={job.severity} />
          <Badge tone="blue">{job.skill}</Badge>
        </div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-[28px]">
          {job.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-neutral-500">
          <span>{job.vehicle}</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {job.distanceKm} km
          </span>
          <span className="flex items-center gap-1">
            <Route className="h-3.5 w-3.5" /> {job.location}
          </span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card>
            <CardBody>
              <p className="eyebrow mb-4">Progress</p>
              <StatusTracker status={job.status} />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="eyebrow mb-2.5">Reported issue</p>
              <p className="text-[14px] leading-relaxed text-neutral-700">
                {job.description}
              </p>
              {job.obd && (
                <div className="mt-3 rounded-xl bg-neutral-50 px-4 py-3 font-mono text-[13px] text-ink">
                  {job.obd}
                </div>
              )}
            </CardBody>
          </Card>

          {job.mismatch && (
            <Card>
              <CardBody>
                <p className="eyebrow mb-2.5 flex items-center gap-1.5">
                  <TriangleAlert className="h-3.5 w-3.5 text-warning" />
                  Estimate mismatch reported
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[12px] text-neutral-500">Actual cost</p>
                    <p className="text-[14px] font-semibold text-ink">
                      {formatNaira(job.mismatch.actualCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-neutral-500">Actual duration</p>
                    <p className="text-[14px] font-semibold text-ink">
                      {job.mismatch.actualDuration}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[13px] italic text-neutral-600">
                  “{job.mismatch.reason}”
                </p>
              </CardBody>
            </Card>
          )}

          {completed && (
            <Card>
              <CardBody>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <p className="text-[15px] font-bold text-ink">Job completed</p>
                </div>
                <p className="mt-1 flex items-center gap-1 text-[13px] text-neutral-500">
                  <Clock className="h-3.5 w-3.5" />
                  {job.completedTs ? timeAgo(job.completedTs) : ""}
                </p>
                {job.completionNote && (
                  <p className="mt-3 text-[14px] italic text-neutral-600">
                    “{job.completionNote}”
                  </p>
                )}
              </CardBody>
            </Card>
          )}
        </div>

        {/* Action panel */}
        {!completed && (
          <div className="lg:sticky lg:top-[92px] lg:self-start">
            <Card>
              <CardBody>
                <p className="eyebrow mb-1">Next step</p>
                <h3 className="font-display text-lg font-bold text-ink">
                  {primaryLabel}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">
                  {job.status === "in_progress"
                    ? "Run through the quality checks, then close the job."
                    : "Advance the job as you move through the visit."}
                </p>
                <Button block size="lg" className="mt-4" onClick={onPrimary}>
                  {primaryLabel}
                </Button>
                <Button
                  block
                  variant="outline"
                  className="mt-2"
                  onClick={() => setMismatchOpen(true)}
                >
                  Report estimate mismatch
                </Button>
              </CardBody>
            </Card>
          </div>
        )}
      </div>

      <QualityChecklistModal
        open={qualityOpen}
        onClose={() => setQualityOpen(false)}
        onComplete={completeJob}
      />
      <EstimateMismatchModal
        open={mismatchOpen}
        onClose={() => setMismatchOpen(false)}
        onSubmit={submitMismatch}
      />
    </div>
  );
}

function nextOf(s: ActiveStatus): ActiveStatus {
  return nextStatus(s) ?? s;
}
