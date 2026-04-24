import os from "node:os";

export type SupportedPlatform = "windows" | "linux" | "macos" | "unknown";

export function detectPlatform(): SupportedPlatform {
  switch (process.platform) {
    case "win32":
      return "windows";
    case "linux":
      return "linux";
    case "darwin":
      return "macos";
    default:
      return "unknown";
  }
}

export function detectHostIp() {
  const interfaces = os.networkInterfaces();

  for (const addresses of Object.values(interfaces)) {
    for (const address of addresses || []) {
      if (address.family === "IPv4" && !address.internal) {
        return address.address;
      }
    }
  }

  return "127.0.0.1";
}
