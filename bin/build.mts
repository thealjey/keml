import { build } from "esbuild";
import { createReadStream } from "node:fs";
import { glob, readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { promisify } from "node:util";
import { gzip as gzipWithCallbacks } from "node:zlib";
import pkg from "../package.json" with { type: "json" };

const gzip = promisify(gzipWithCallbacks);

const { description, homepage, license, main, name, repository, version } = pkg;
const environment = process.env["NODE_ENV"] ?? "production";

const define: Record<string, string> = {
  "process.env.NODE_ENV": JSON.stringify(environment),
};

if (environment === "docs") {
  const suffix = "-server.html";
  const queue = [];

  for await (const entry of glob(`docs/snippets/*${suffix}`)) {
    queue.push(
      Promise.all([
        basename(entry).slice(0, -suffix.length),
        readFile(entry, "utf8"),
      ]),
    );
  }

  define["process.env.TEMPLATES"] = JSON.stringify(
    Object.fromEntries(await Promise.all(queue)),
  );

  define["process.env.ROUTES"] = JSON.stringify(
    (await readFile("docs/snippets/routes.txt", "utf8"))
      .trim()
      .split(/\r?\n/)
      .map(value => {
        const [mode, key, val] = value.split(/\s*=>\s*/) as [
          string,
          string,
          string | undefined,
        ];
        return [+mode, key, val ?? key] as const;
      }),
  );
}

await build({
  entryPoints: ["src/index.e.mts"],
  bundle: true,
  minify: true,
  outfile: environment === "docs" ? "docs/assets/" + main : main,
  define,
  logLevel: "info",
  banner: {
    js: `/*!
 * ${name} ${version} ${description}
 * Docs: ${homepage}
 * Repo: ${repository.url.slice(4, -4)}/
 * ${license} (see LICENSE)
 */`,
  },
});

const { length } = await gzip(await readFile(main));

let size = (length / 1024).toFixed(1);
if (size.endsWith(".0")) {
  size = size.slice(0, -2);
}

for (const input of ["README.md", resolve("docs", "index.md")]) {
  let found = false;
  let output = "";
  for await (let line of createInterface({ input: createReadStream(input) })) {
    if (!found && line.startsWith("![min+gzip]")) {
      line = line.replace(/-\d+(?:\.\d+)?kb-/, `-${size}kb-`);
      found = true;
    }
    output += line + "\n";
  }
  await writeFile(input, output);
}
