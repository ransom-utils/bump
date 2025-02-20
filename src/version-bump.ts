import { type VersionBumpResult } from "./types/version-bump-results";
import { type VersionBumpOptions } from "./types/version-bump-options";
import { Operation } from './operation'
import { getCurrentVersion } from "./get-current-version";
import { getNewVersion } from "./get-new-version";
import { runNpmScript } from "./run-npm-script";
import { updateFiles } from "./update-files";
import { NpmScript } from "./types/version-bump-progress";
import { gitCommit, gitPush, gitTag } from "./git";


/**
 * Prompts the user for a version number and updates package.json and package-lock.json
 * 
 * @returns - The new version number
 */

export async function versionBump(): Promise<VersionBumpResult>;


/**
 * Bump the version number in package.json and package-lock.json
 * 
 * @param release - The release version or type. Can be one of the following:
 * 
 * 
 * - The new version number (e.g. "1.23.456")
 * - A release type (e.g. "major", "minor", "patch", "premajor", "preminor", "prepatch", "prerelease")
 * - "prompt" to prompt the user for the new version number
 */

export async function versionBump(release: string): Promise<VersionBumpResult>



/**
 * Bumps the version number in or more files, prompting the user if necessary
 * Optionally also commits, tags, and push to git
 * 
 */

export async function versionBump(options: VersionBumpOptions): Promise<VersionBumpResult>





export async function versionBump(arg = {}): Promise<VersionBumpResult> {
  if (typeof arg === 'string') {
    arg = { release: arg }
  }

  let operation = await Operation.start(arg);
  // Get the old and new version numbers
  await getCurrentVersion(operation);
  await getNewVersion(operation);
  // Run npm preversion script, if any
  await runNpmScript(NpmScript.PreVersion, operation);
  // Update the version number in all files
  await updateFiles(operation);
  // Run npm version script, if any
  await runNpmScript(NpmScript.Version, operation);
  // Git commit and tag, if enabled
  await gitCommit(operation);
  await gitTag(operation);
  // Run npm postversion script, if any
  await runNpmScript(NpmScript.PostVersion, operation);
  // Push the git commit and tag, if enabled
  await gitPush(operation);
  return operation.results;
}