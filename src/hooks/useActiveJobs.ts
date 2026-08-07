import { useCallback, useState } from "react";
import {
  getActive,
  nextStatus,
  saveActive,
  type ActiveJob,
  type ActiveStatus,
} from "@/lib/activeJobs";

// Read/mutate the active-job list. Backed by localStorage; used by My Jobs and
// the active-job execution page.
export function useActiveJobs() {
  const [jobs, setJobs] = useState<ActiveJob[]>(() => getActive());

  const persist = useCallback((next: ActiveJob[]) => {
    setJobs(next);
    saveActive(next);
  }, []);

  const byId = useCallback(
    (id: string) => jobs.find((j) => j.jobId === id),
    [jobs]
  );

  const update = useCallback(
    (id: string, patch: Partial<ActiveJob>) =>
      persist(jobs.map((j) => (j.jobId === id ? { ...j, ...patch } : j))),
    [jobs, persist]
  );

  const advance = useCallback(
    (id: string) => {
      const job = jobs.find((j) => j.jobId === id);
      if (!job) return;
      const ns = nextStatus(job.status);
      if (!ns) return;
      const now = Date.now();
      persist(
        jobs.map((j) =>
          j.jobId === id
            ? {
                ...j,
                status: ns,
                history: [...j.history, { status: ns, ts: now }],
                ...(ns === "completed" ? { completedTs: now } : {}),
              }
            : j
        )
      );
    },
    [jobs, persist]
  );

  const setStatus = useCallback(
    (id: string, status: ActiveStatus) => update(id, { status }),
    [update]
  );

  return { jobs, byId, update, advance, setStatus };
}
