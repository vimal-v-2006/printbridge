import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { PrintJob } from "@printbridge/shared";
import { runCommand } from "./shell.js";

async function downloadJobFile(job: PrintJob) {
  const response = await fetch(job.fileUrl);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const dir = path.join(os.tmpdir(), "printbridge-jobs");
  await mkdir(dir, { recursive: true });
  const outputPath = path.join(dir, `${job.id}-${job.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`);
  await writeFile(outputPath, Buffer.from(arrayBuffer));
  return outputPath;
}

async function printOnWindows(filePath: string, printerName: string, copies: number) {
  for (let i = 0; i < copies; i += 1) {
    const script = `Start-Process -FilePath '${filePath.replace(/'/g, "''")}' -Verb PrintTo -ArgumentList '"${printerName.replace(/'/g, "''")}"'; Start-Sleep -Seconds 5`;
    await runCommand("powershell.exe", ["-NoProfile", "-Command", script]);
  }
}

export async function executePrintJob(job: PrintJob) {
  const filePath = await downloadJobFile(job);

  if (process.platform === "win32") {
    await printOnWindows(filePath, job.printerName, job.settings.copies || 1);
    return { filePath };
  }

  throw new Error("Print execution is currently implemented for Windows only");
}
