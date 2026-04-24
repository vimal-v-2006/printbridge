import type { Agent } from "@printbridge/shared";
import { resolveBackendUrl } from "./lib/backend-discovery.js";
import { getConfig } from "./lib/config.js";
import { executePrintJob } from "./lib/print.js";
import { detectPrinters } from "./lib/printers.js";
import { detectHostIp, detectPlatform } from "./lib/system.js";
import { claimJob, registerAgent, syncPrinters, updateJobStatus } from "./services/backend.js";

const config = getConfig();
let backendUrl = "";

async function runSyncCycle() {
  const agent: Agent = {
    id: config.agentId,
    name: config.agentName,
    host: config.agentHost,
    ipAddress: config.agentIp || detectHostIp(),
    status: "online",
    lastSeenAt: new Date().toISOString(),
  };

  await registerAgent(backendUrl, agent);
  const printers = await detectPrinters(config.agentId);
  await syncPrinters(backendUrl, config.agentId, printers);

  console.log(`[agent] platform=${detectPlatform()} synced ${printers.length} printer(s) to ${backendUrl}`);
}

async function runJobCycle() {
  const job = await claimJob(backendUrl, config.agentId);
  if (!job) return;

  console.log(`[agent] claimed job ${job.id} for ${job.fileName}`);

  try {
    await updateJobStatus(backendUrl, job.id, { status: "printing" });
    await executePrintJob(job);
    await updateJobStatus(backendUrl, job.id, { status: "completed" });
    console.log(`[agent] completed job ${job.id}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await updateJobStatus(backendUrl, job.id, { status: "failed", error: message });
    console.error(`[agent] job ${job.id} failed`, error);
  }
}

async function main() {
  backendUrl = await resolveBackendUrl(config.backendUrl || undefined);
  console.log(`[agent] using backend ${backendUrl}`);

  await runSyncCycle();
  setInterval(async () => {
    try {
      await runSyncCycle();
    } catch (error) {
      console.error("[agent] sync failed", error);
    }
  }, config.syncIntervalMs);

  setInterval(async () => {
    try {
      await runJobCycle();
    } catch (error) {
      console.error("[agent] job polling failed", error);
    }
  }, 5000);
}

main().catch((error) => {
  console.error("[agent] startup failed", error);
  process.exit(1);
});
