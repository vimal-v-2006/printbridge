export function getConfig() {
  return {
    backendUrl: process.env.BACKEND_URL || "http://127.0.0.1:4000",
    agentId: process.env.AGENT_ID || "agent-local-1",
    agentName: process.env.AGENT_NAME || "Office PC",
    agentHost: process.env.AGENT_HOST || process.env.HOSTNAME || "localhost",
    agentIp: process.env.AGENT_IP || "",
    syncIntervalMs: Number(process.env.SYNC_INTERVAL_MS || 30000),
  };
}
