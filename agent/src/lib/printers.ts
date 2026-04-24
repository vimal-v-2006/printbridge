import type { Printer } from "@printbridge/shared";
import { detectPlatform } from "./system.js";
import { runCommand } from "./shell.js";

type WindowsPrinterRow = {
  Name?: string;
  Default?: boolean;
  PrinterStatus?: number;
};

function mapPrinterStatus(status?: number): Printer["status"] {
  if (status === 4 || status === 5) return "busy";
  if (status === 7) return "offline";
  return "idle";
}

async function detectWindowsPrinters(agentId: string): Promise<Printer[]> {
  const script = [
    "Get-Printer | Select-Object Name, Default, PrinterStatus | ConvertTo-Json -Depth 3",
  ].join(" ");

  const { stdout } = await runCommand("powershell.exe", ["-NoProfile", "-Command", script]);
  const parsed = JSON.parse(stdout || "[]") as WindowsPrinterRow | WindowsPrinterRow[];
  const rows = Array.isArray(parsed) ? parsed : [parsed];

  return rows
    .filter((row) => row?.Name)
    .map((row, index) => ({
      id: `${agentId}-printer-${index + 1}`,
      agentId,
      name: row.Name as string,
      isDefault: Boolean(row.Default),
      status: mapPrinterStatus(row.PrinterStatus),
      capabilities: {
        color: true,
        duplex: true,
        paperSizes: ["A4", "Letter"],
      },
    }));
}

async function detectUnixPrinters(agentId: string): Promise<Printer[]> {
  const { stdout } = await runCommand("lpstat", ["-p", "-d"]);
  const lines = stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const defaultLine = lines.find((line) => line.startsWith("system default destination:"));
  const defaultPrinter = defaultLine?.split(":").slice(1).join(":").trim();

  const printerNames = lines
    .filter((line) => line.startsWith("printer "))
    .map((line) => line.replace(/^printer\s+/, "").split(" ")[0])
    .filter(Boolean);

  return printerNames.map((name, index) => ({
    id: `${agentId}-printer-${index + 1}`,
    agentId,
    name,
    isDefault: name === defaultPrinter,
    status: "idle",
    capabilities: {
      color: true,
      duplex: true,
      paperSizes: ["A4", "Letter"],
    },
  }));
}

export async function detectPrinters(agentId: string): Promise<Printer[]> {
  const platform = detectPlatform();

  try {
    if (platform === "windows") {
      return await detectWindowsPrinters(agentId);
    }

    if (platform === "linux" || platform === "macos") {
      return await detectUnixPrinters(agentId);
    }
  } catch (error) {
    console.error(`[agent] printer detection failed on ${platform}`, error);
  }

  return [];
}
