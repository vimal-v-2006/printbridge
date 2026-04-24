import { detectHostIp } from "./system.js";

async function isHealthy(baseUrl: string) {
  try {
    const response = await fetch(`${baseUrl}/health`, {
      signal: AbortSignal.timeout(1000),
    });

    if (!response.ok) return false;
    const data = (await response.json()) as { ok?: boolean; service?: string };
    return data.ok === true && data.service === "printbridge-backend";
  } catch {
    return false;
  }
}

export async function resolveBackendUrl(explicitUrl?: string) {
  if (explicitUrl) return explicitUrl;

  const localCandidates = ["http://127.0.0.1:4000", "http://localhost:4000"];
  for (const candidate of localCandidates) {
    if (await isHealthy(candidate)) return candidate;
  }

  const localIp = detectHostIp();
  const parts = localIp.split(".");
  if (parts.length !== 4) {
    throw new Error("Could not auto-discover backend URL on this network");
  }

  const prefix = `${parts[0]}.${parts[1]}.${parts[2]}`;
  console.log(`[agent] auto-discovering backend on ${prefix}.0/24 ...`);

  for (let i = 1; i <= 254; i += 1) {
    if (i % 25 === 0) {
      console.log(`[agent] backend scan progress: checked up to ${prefix}.${i}`);
    }

    const candidate = `http://${prefix}.${i}:4000`;
    if (await isHealthy(candidate)) return candidate;
  }

  throw new Error("Could not auto-discover backend URL on this network");
}
