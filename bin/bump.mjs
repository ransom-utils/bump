#!/usr/bin/env node
import("../lib/cli.js").then((r) => r.main());

// import("../lib/cli.js").then((r) => r.main());

// esm is async by nature, to avoid  Async Infection
// use tsup or unbuild to ship both esm and cjs bundle
// grant execution permission on new/existed files under bin dir

/**
 * process.argv[0]: The path to the Node.js executable
 * process.argv[1]: The path to the script file being executed
 */

// as __dirname which is only available in the cjs
//  import.meta.url which is only available in the esm module
// const cwd = fileURLToPath(new URL('.', import.meta.url))

// to make require available in your esm bundle
/**
 * export default defineConfig({
  banner: ({ format }) => {
    if (format === 'esm') {
      return {
        js: 'import {createRequire as __createRequire} from \'module\';var require=__createRequire(import.meta.url);',
      }
    }
  },
})
*/
