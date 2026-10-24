/**
 * Rebuilds the pages whenever a file in `src/` or `scripts/` changes. Each build
 * runs in a fresh process, so edited modules are always read again. Node's own
 * `--watch-path` would do this on macOS and Windows only.
 */
import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

let running = false;
let queued = false;
let timer;

function build() {
  if (running) {
    queued = true;
    return;
  }
  running = true;
  spawn(process.execPath, ["scripts/build.js"], { cwd: root, stdio: "inherit" }).on("exit", () => {
    running = false;
    if (queued) {
      queued = false;
      build();
    }
  });
}

for (const directory of ["src", "scripts"]) {
  watch(new URL(`../${directory}/`, import.meta.url), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(build, 100);
  });
}

build();
