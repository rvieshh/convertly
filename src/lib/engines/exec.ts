import { promises as fs } from "fs";
import { tmpdir } from "os";
import path from "path";
import { randomUUID } from "crypto";
import { spawn } from "child_process";

/** Run a command, resolving on exit 0, rejecting with stderr otherwise. */
export function run(cmd: string, args: string[], timeoutMs = 120_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`${cmd} timed out`));
    }, timeoutMs);
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(stderr.trim().split("\n").slice(-3).join(" ") || `${cmd} exited ${code}`));
    });
  });
}

/** Create a unique working directory under the OS temp dir. */
export async function makeWorkDir(): Promise<string> {
  const dir = path.join(tmpdir(), `convertly-${randomUUID()}`);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function cleanup(dir: string) {
  await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
}
