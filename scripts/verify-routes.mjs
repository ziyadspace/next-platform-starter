import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const host = "127.0.0.1";
const port = "4011";
const origin = `http://${host}:${port}`;
const routes = [
  "/",
  "/auth",
  "/design",
  "/cart",
  "/checkout",
  "/account",
  "/account/designs",
  "/account/orders",
  "/account/orders/demo-order",
  "/track",
  "/order/success/demo-order",
];

const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const server = spawn(process.execPath, [nextBin, "start", "--hostname", host, "--port", port], {
  stdio: ["ignore", "pipe", "pipe"],
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(origin, { redirect: "manual" });
      if (response.status > 0) { ready = true; break; }
    } catch {
      await wait(150);
    }
  }
  if (!ready) throw new Error("Production server did not become ready.");
  let failed = false;
  for (const route of routes) {
    const response = await fetch(`${origin}${route}`, { redirect: "manual" });
    const ok = response.status >= 200 && response.status < 400;
    console.log(`${ok ? "PASS" : "FAIL"} ${response.status} ${route}`);
    if (!ok) failed = true;
  }
  if (failed) process.exitCode = 1;
} finally {
  server.kill("SIGTERM");
}
