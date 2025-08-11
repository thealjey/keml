import { build } from "esbuild";
import { createReadStream } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { promisify } from "node:util";
import { gzip as gzipWithCallbacks } from "node:zlib";
import pkg from "./package.json" with { type: "json" };

const gzip = promisify(gzipWithCallbacks);

const { description, homepage, license, main, name, repository, version } = pkg;

await build({
  entryPoints: ["src/index.mts"],
  bundle: true,
  minify: true,
  mangleProps: /_$/,
  define: { "import.meta.vitest": "false" },
  outfile: main,
  logLevel: "info",
  banner: {
    js: `/*!
 * ${name} v${version} - ${description}
 *
 * Docs:  ${homepage}
 * Repo:  ${repository.url.slice(4, -4)}/
 * NPM:   https://www.npmjs.com/package/${name}/
 *
 * Licensed under the ${license} License. See LICENSE file for details.
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
