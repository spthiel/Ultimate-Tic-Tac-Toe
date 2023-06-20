import * as esbuild from 'esbuild';
esbuild.build({
    platform: "node",
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    target: "node18",
    outfile: "dist/index.js"
})