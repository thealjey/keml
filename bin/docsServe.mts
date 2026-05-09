import { spawn } from "node:child_process";
import { watch } from "node:fs/promises";

const exec = (command: string) =>
  new Promise<void>((resolve, reject) =>
    spawn(command, {
      stdio: "inherit",
      shell: true,
      env: { ...process.env, NODE_ENV: "docs" },
    })
      .on("close", code => (code === 0 ? resolve : reject)())
      .on("error", reject),
  );

let building = false;
let pending = false;
async function build() {
  if (building) {
    pending = true;
    return;
  }
  building = true;

  try {
    await exec("npm run build");

    if (pending) {
      pending = false;
      await build();
    }
  } finally {
    building = false;
  }
}

let timeoutId: NodeJS.Timeout;
const wd = async (path: string, pattern: RegExp) => {
  for await (const { filename } of watch(path, { recursive: true })) {
    if (filename && pattern.test(filename)) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(build, 500);
    }
  }
};

await build();

wd("src", /\.mts$/);
wd("docs/snippets", /(-server\.html|\.txt)$/);

await exec("mkdocs serve -o");
