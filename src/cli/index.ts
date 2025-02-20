/**
 * The main entry point of the CLI
 * @param args - The command-line arguments(e.g. ["major", "--preid=alpha", "-ctpa"])
 */

import { helpText } from "./help"
import { manifest } from '../manifest'


import { parseArgs } from './parse-args'
import { ExitCode } from './exit-code'
import { type VersionBumpProgress, ProgressEvent } from '../types/version-bump-progress'
import { symbols } from './symbols'
import { versionBump } from "../version-bump"




export async function main(): Promise<void> {
  try {
    // setup global error handlers
    process.on('uncaughtException', errorHandler)
    process.on('unhandledRejection', errorHandler)

    // parse the command-line arguments
    let { help, version, quiet, options } = await parseArgs()
    // if (help) {
    //   console.log(helpText)
    //   process.exit(ExitCode.Success)
    // }
    // else if (version) {
    //   console.log(manifest.version)
    //   process.exit(ExitCode.Success)
    // }
    if (help || version) {
      // Will be handled by cac, just need to exit
      process.exit(ExitCode.Success)
    }
    else {
      if (!quiet) {
        options.progress = progress
      }
      await versionBump(options)
    }
  } catch (error) {
    errorHandler(error)
  }
}

function progress({ event, script, updatedFiles, skippedFiles, newVersion }: VersionBumpProgress): void {
  switch (event) {
    case ProgressEvent.FileUpdated:
      console.log(symbols.success, `Updated ${updatedFiles.pop()} to ${newVersion}`)
      break;
    case ProgressEvent.FileSkipped:
      console.log(symbols.info, ` ${skippedFiles.pop()} did not need to be updated `)
      break;
    case ProgressEvent.GitCommit:
      console.log(symbols.success, `Git commit`)
      break;
    case ProgressEvent.GitTag:
      console.log(symbols.success, 'Git tag')
      break;
    case ProgressEvent.GitPush:
      console.log(symbols.success, `Git push`)
      break;
    case ProgressEvent.NpmScript:
      console.log(symbols.success, `Npm run ${script}`)
      break;
  }
}


function errorHandler(error) {
  let message = error.message || String(error)
  if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
    message = error.stack || message
  }
  console.error(message)
  process.exit(ExitCode.FatalError)
}