import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  Clock,
  Image as ImageIcon,
  Info,
  MapPin,
  Route,
  Video,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { useFeedState } from "@/hooks/useFeedState";
import { findJob } from "@/lib/mockData";
import { timeAgo } from "@/lib/format";
import { addQuote, newQuoteId, type QuoteRecord } from "@/lib/quotes";
import {
  SubmitEstimateModal,
  type EstimatePayload,
} from "@/components/jobs/SubmitEstimateModal";
import {
  BusinessQuoteModal,
  type BusinessQuotePayload,
} from "@/components/jobs/BusinessQuoteModal";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardBody>
        <p className="eyebrow mb-2.5">{title}</p>
        {children}
      </CardBody>
    </Card>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const job = findJob(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { quote, dismiss } = useFeedState();
  const [modalOpen, setModalOpen] = useState(false);

  if (!job) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Job not found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          This job may have been taken or is no longer available.
        </p>
        <Link to="/jobs" className="mt-5 inline-block">
          <Button>Back to jobs</Button>
        </Link>
      </div>
    );
  }

  const isBusiness = user?.accountType === "business";
  const vehicleLabel = `${job.vehicle.year} ${job.vehicle.make} ${job.vehicle.model}`;

  function finishQuote(rec: QuoteRecord) {
    addQuote(rec);
    quote(job!.id);
    setModalOpen(false);
    toast("Quote submitted. Find it in My Jobs.", "success");
    navigate("/my-jobs");
  }

  function onEstimate(p: EstimatePayload) {
    finishQuote({
      id: newQuoteId(),
      jobId: job!.id,
      jobTitle: job!.title,
      vehicle: `${vehicleLabel} · ${job!.vehicle.plate}`,
      path: "individual",
      ts: Date.now(),
      status: "pending",
      ...p,
    });
  }

  function onBusinessQuote(p: BusinessQuotePayload) {
    finishQuote({
      id: newQuoteId(),
      jobId: job!.id,
      jobTitle: job!.title,
      vehicle: `${vehicleLabel} · ${job!.vehicle.plate}`,
      path: "business",
      ts: Date.now(),
      status: "pending",
      ...p,
    });
  }

  function decline() {
    dismiss(job!.id);
    toast("Job declined");
    navigate("/jobs");
  }

  return (
    <div>
      <Link
        to="/jobs"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-500 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="mb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={job.severity} />
          <Badge tone="neutral" className="capitalize">
            {job.jobType}
          </Badge>
          <Badge tone="blue">{job.skill}</Badge>
        </div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-[28px]">
          {job.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-neutral-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {job.distanceKm} km
          </span>
          <span className="flex items-center gap-1">
            <Route className="h-3.5 w-3.5" /> {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {timeAgo(job.createdTs)}
          </span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Evidence */}
        <div className="space-y-4">
          <Section title="Reported issue">
            <p className="text-[14px] leading-relaxed text-neutral-700">
              {job.description}
            </p>
          </Section>

          <Section title="OBD diagnostics">
            {job.obd ? (
              <div className="rounded-xl bg-neutral-50 px-4 py-3 font-mono text-[13px] text-ink">
                {job.obd}
              </div>
            ) : (
              <div className="flex items-start gap-2 rounded-xl bg-warning-50 px-4 py-3 text-[13px] text-warning">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                No fault codes detected. The issue may be mechanical, inspect on
                site.
              </div>
            )}
          </Section>

          <Section title="Vehicle">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
              <div>
                <p className="text-[12px] text-neutral-500">Make & model</p>
                <p className="text-[14px] font-semibold text-ink">
                  {job.vehicle.make} {job.vehicle.model}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-neutral-500">Year</p>
                <p className="text-[14px] font-semibold text-ink">
                  {job.vehicle.year}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-neutral-500">Plate</p>
                <p className="text-[14px] font-semibold text-ink">
                  {job.vehicle.plate}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-neutral-500">Type</p>
                <p className="flex items-center gap-1 text-[14px] font-semibold text-ink">
                  <Car className="h-3.5 w-3.5 text-neutral-400" />
                  {job.vehicle.type}
                </p>
              </div>
            </div>
          </Section>

          {job.fleetNote && (
            <Section title="Fleet manager notes">
              <p className="text-[14px] italic leading-relaxed text-neutral-700">
                “{job.fleetNote}”
              </p>
            </Section>
          )}

          {job.attachments && job.attachments.length > 0 && (
            <Section title={`Attachments (${job.attachments.length})`}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {job.attachments.map((a, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-line"
                  >
                    <div className="grid aspect-video place-items-center bg-neutral-100">
                      {a.type === "video" ? (
                        <Video className="h-7 w-7 text-neutral-400" />
                      ) : (
                        <ImageIcon className="h-7 w-7 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                      <span className="truncate text-[12px] font-medium text-ink">
                        {a.label}
                      </span>
                      <Badge tone="neutral" className="capitalize">
                        {a.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Quote panel */}
        <div className="lg:sticky lg:top-[76px] lg:self-start">
          <Card>
            <CardBody>
              <p className="eyebrow mb-1">
                {isBusiness ? "Business quote" : "Your estimate"}
              </p>
              <h3 className="font-display text-lg font-bold text-ink">
                {isBusiness ? "Quote for this job" : "Estimate this job"}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">
                {isBusiness
                  ? "Break down labour, parts, and timeline, and assign a technician from your team."
                  : "Give the customer a clear cost range, timeline, and your confidence."}
              </p>

              <Button
                block
                size="lg"
                className="mt-4"
                onClick={() => setModalOpen(true)}
              >
                {isBusiness ? "Submit quote" : "Submit estimate"}
              </Button>
              <Button block variant="ghost" className="mt-2" onClick={decline}>
                Decline job
              </Button>

              <p className="mt-4 flex items-start gap-1.5 text-[12px] text-neutral-400">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Your quote is sent to the customer for review.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {isBusiness ? (
        <BusinessQuoteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={onBusinessQuote}
        />
      ) : (
        <SubmitEstimateModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={onEstimate}
        />
      )}
    </div>
  );
}
