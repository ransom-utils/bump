
/**
 * Progress events that indicate the progress of the `versionBump()` function
 */

import { type VersionBumpResult } from "./version-bump-results"

export const enum ProgressEvent {
  FileUpdated = 'file updated',
  FileSkipped = 'file skipped',
  GitCommit = 'git commit',
  GitTag = 'git tag',
  GitPush = 'git push',
  NpmScript = 'npm script'
}



/**
 * The NPM version scripts
 */

export const enum NpmScript {
  PreVersion = "preversion",
  Version = "version",
  PostVersion = "postversion"
}


/**
 * Info about the progress of the `versionBump()` function
 */

export interface VersionBumpProgress extends VersionBumpResult {
  event: ProgressEvent
  script?: NpmScript
}