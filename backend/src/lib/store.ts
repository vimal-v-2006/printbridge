import type {
  Agent,
  Printer,
  PrintJob,
  CreatePrintJob,
  PrintJobStatus,
} from "@printbridge/shared";

const now = () => new Date().toISOString();

export const agents: Agent[] = [];
export const printers: Printer[] = [];
export const jobs: PrintJob[] = [];

export function upsertAgent(agent: Agent) {
  const index = agents.findIndex((item) => item.id === agent.id);
  if (index >= 0) agents[index] = agent;
  else agents.push(agent);
  return agent;
}

export function replacePrinters(agentId: string, nextPrinters: Printer[]) {
  for (let i = printers.length - 1; i >= 0; i -= 1) {
    if (printers[i]?.agentId === agentId) printers.splice(i, 1);
  }
  printers.push(...nextPrinters);
  return nextPrinters;
}

export function createJob(input: CreatePrintJob): PrintJob {
  const createdAt = now();
  const job: PrintJob = {
    id: crypto.randomUUID(),
    status: "queued",
    createdAt,
    updatedAt: createdAt,
    ...input,
  };
  jobs.unshift(job);
  return job;
}

export function listJobsByAgent(agentId: string) {
  return jobs.filter((job) => job.agentId === agentId);
}

export function claimNextJob(agentId: string) {
  const job = jobs.find((item) => item.agentId === agentId && item.status === "queued");
  if (!job) return null;
  job.status = "downloading";
  job.updatedAt = now();
  return job;
}

export function updateJobStatus(jobId: string, status: PrintJobStatus, error?: string) {
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return null;
  job.status = status;
  job.updatedAt = now();
  job.error = error;
  if (status === "completed" || status === "failed") {
    job.completedAt = now();
  }
  return job;
}
