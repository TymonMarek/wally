import { build } from "esbuild";

await build({
  entryPoints: ["build/index.js"],
  bundle: true,
  minify: true,
  platform: "node",
  packages: "external",
  outfile: "dist/index.js",
});
