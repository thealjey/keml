import { build } from "esbuild";
import pkg from "./package.json" with { type: "json" };

const { description, homepage, license, name, repository, version } = pkg;

await build({
  entryPoints: ["src/index.mts"],
  bundle: true,
  minify: true,
  mangleProps: /_$/,
  define: { "import.meta.vitest": "false" },
  outfile: "keml.js",
  logLevel: "info",
  banner: {
    js: `/*!
 * keml v${version} - ${description}
 *
 * Docs:  ${homepage}
 * Repo:  ${repository.url.slice(4, -4)}/
 * NPM:   https://www.npmjs.com/package/${name}/
 *
 * Licensed under the ${license} License. See LICENSE file for details.
 */`,
  },
});
