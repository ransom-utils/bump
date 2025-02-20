import { Operation } from "./operation";
import { NpmScript, ProgressEvent } from "./types/version-bump-progress";
import { isManifest, type Manifest } from "./manifest";
import { readJsonFile } from "./fs";
import { x } from 'tinyexec'
const run = (bin, args, opts = {}) =>
  x(bin, args, { throwOnError: true, ...opts })

/**
 * Runs the specified NPM script in the package.json file.
 */
export async function runNpmScript(script: NpmScript, operation: Operation): Promise<Operation> {

  let { cwd, ignoreScripts } = operation.options;
  if (!ignoreScripts) {
    let { data: manifest } = await readJsonFile("package.json", cwd);
    if (isManifest(manifest) && hasScript(manifest, script)) {
      await run("npm", ["run", script, "--silent"], { stdio: "inherit" });
      operation.update({ event: ProgressEvent.NpmScript, script });
    }
  }
  return operation;
};


/**
 * Determines whether the specified NPM script exists in the given manifest.
 */
function hasScript(manifest: Manifest, script: NpmScript): boolean {
  let scripts = manifest.scripts;
  if (scripts && typeof scripts === "object") {
    return Boolean(scripts[script]);
  }
  return false;
}