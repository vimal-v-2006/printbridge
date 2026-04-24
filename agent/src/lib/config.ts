function readCliFlag(name: string) {
  const key = `--${name}`;
  const args = process.argv.slice(2);

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === key) {
      return args[index + 1] || "";
    }
    if (args[index]?.startsWith(`${key}=`)) {
      return args[index].slice(key.length + 1);
    }
  }

  return "";
}

export function getConfig() {
  return {
    backendUrl: readCliFlag("backendUrl") || process.env.BACKEND_URL || "http://127.0.0.1:4000",
    agentId: readCliFlag("agentId") || process.env.AGENT_ID || "agent-local-1",
    agentName: readCliFlag("agentName") || process.env.AGENT_NAME || "Office PC",
    agentHost: readCliFlag("agentHost") || process.env.AGENT_HOST || process.env.HOSTNAME || "localhost",
    agentIp: readCliFlag("agentIp") || process.env.AGENT_IP || "",
    syncIntervalMs: Number(readCliFlag("syncIntervalMs") || process.env.SYNC_INTERVAL_MS || 30000),
  };
}
