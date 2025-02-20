import { defineConfig } from 'tsup'
export default defineConfig({
  outDir: "lib",
  banner: ({ format }) => {
    if (format === 'esm') {
      return {
        js: 'import {createRequire as __createRequire} from \'module\';var require=__createRequire(import.meta.url);',
      }
    }
  },
  // When building the cjs bundle, it will compile import.meta.url as typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href
  // When building the esm bundle, it will compile __dirname as path.dirname(fileURLToPath(import.meta.url))    const cwd = fileURLToPath(new URL('.', import.meta.url))
  // shims: true, no long need anymore, node native support esm and import.meta.url
})