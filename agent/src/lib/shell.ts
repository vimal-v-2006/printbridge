import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function runCommand(command: string, args: string[]) {
  const result = await execFileAsync(command, args, {
    timeout: 15000,
    windowsHide: true,
    maxBuffer: 1024 * 1024,
  });

  return {
    stdout: result.stdout?.toString() || "",
    stderr: result.stderr?.toString() || "",
  };
}
