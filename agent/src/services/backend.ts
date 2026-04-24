import type { Agent, Printer, PrintJob, UpdatePrintJobStatus } from "@printbridge/shared";

export async function registerAgent(baseUrl: string, agent: Agent) {
  const response = await fetch(`${baseUrl}/agents/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(agent),
  });

  if (!response.ok) {
    throw new Error(`Agent registration failed: ${response.status}`);
  }

  return response.json();
}

export async function syncPrinters(baseUrl: string, agentId: string, printers: Printer[]) {
  const response = await fetch(`${baseUrl}/agents/${agentId}/printers`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(printers),
  });

  if (!response.ok) {
    throw new Error(`Printer sync failed: ${response.status}`);
  }

  return response.json();
}

export async function claimJob(baseUrl: string, agentId: string): Promise<PrintJob | null> {
  const response = await fetch(`${baseUrl}/agents/${agentId}/jobs/claim`, {
    method: "POST",
  });

  if (response.status === 204) return null;
  if (!response.ok) throw new Error(`Job claim failed: ${response.status}`);
  return response.json();
}

export async function updateJobStatus(
  baseUrl: string,
  jobId: string,
  payload: UpdatePrintJobStatus,
) {
  const response = await fetch(`${baseUrl}/jobs/${jobId}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Job status update failed: ${response.status}`);
  }

  return response.json();
}
