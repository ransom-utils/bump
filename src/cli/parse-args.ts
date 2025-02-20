import { type VersionBumpOptions } from '../types/version-bump-options'
import commandLineArgs from 'command-line-args'
import { isReleaseType } from '../release-type'
import semver from 'semver'
import { loadCliArgs, usageText } from './help'
import { ExitCode } from './exit-code'
import { loadBumpConfig } from '../config'

/**
 * The parsed command-line arguments
 */

export interface ParsedArgs {
  help: boolean
  version: boolean
  quiet: boolean
  options: VersionBumpOptions
}

/**
 * Parses the command-line arguments
 */

export async function parseArgs(): Promise<ParsedArgs> {

  try {
    const { args, resultArgs } = loadCliArgs()
    console.log('args->%s\nresultArgs->%s', args, resultArgs)
    const parsedArgs: ParsedArgs = {
      help: args.help as boolean,
      version: args.version as boolean,
      quiet: args.quiet as boolean,
      options: await loadBumpConfig({
        preid: args.preid,
        commit: args.commit,
        tag: args.tag,
        push: args.push,
        all: args.all,
        noVerify: args['no-verify'],
        ignoreScripts: args['ignore-scripts'],
        files: args.files
      })
    }

    // If a version number or release type is specified, then  it will mistakenly be added to the "files"
    if (parsedArgs.options.files && parsedArgs.options.files.length > 0) {
      let firstArg = parsedArgs.options.files[0]
      if (firstArg === 'prompt' || isReleaseType(firstArg) || semver.valid(firstArg)) {
        parsedArgs.options.release = firstArg
        parsedArgs.options.files.shift()
      }
    }
    return parsedArgs
  } catch (error) {
    return errorHandler(error)
  }
}


function errorHandler(error) {
  console.error(error.message || String(error))
  console.error(usageText)
  return process.exit(ExitCode.InvalidArgument)
}