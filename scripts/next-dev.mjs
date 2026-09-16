import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const forwarded = [];
const args = process.argv.slice(2);
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--strictPort") continue;
  if (arg === "--host") {
    forwarded.push("--hostname");
    if (args[index + 1] && !args[index + 1].startsWith("--")) forwarded.push(args[++index]);
    continue;
  }
  forwarded.push(arg);
}

const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const child = spawn(process.execPath, [nextBin, "dev", ...forwarded], { stdio: "inherit" });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
