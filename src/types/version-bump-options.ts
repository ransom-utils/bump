import { type VersionBumpProgress } from "./version-bump-progress";

/**
 * Options for the `versionBump()` function
 */

export interface VersionBumpOptions {
  /**
   * The release version or type. Can be one of the following:
   * 
   * - The new version number (e.g. '1.23.456')
   * - a release type (e.g. 'major', 'minor', 'patch', 'prerelease',etc)
   * - prompt  (prompt the user for the version number)
   *  
   * 
   * Defaults to `prompt`
   */
  release?: string;
  /**
   * the prerelease type (e.g. 'alpha', 'beta', 'next')
   * 
   * Defaults to `beta`
   */
  preid?: string
  /**
   * Indicates whether to create a git commit. Can be set to a custom commit message
   * string or `true` to use "release v".
   * Any `%s` placeholders in the message string will be replaced with the new version number
   * If the message string does _not_ contain any `%s` placeholder, 
   * then the new version number will be appended
   * 
   * Defaults to `false`
   */
  commit?: boolean | string
  /**
   * Indicates whether to tag the git commit. Can be set to a custom tag string
   * or `true` to use "v". placeholders in the tag string  will be replaced with the new version number.
   * If the tag string does _not_ contain any `%s` placeholders,
   * then the new version number will be appended to the tag
   * 
   * Defaults to `false`
   */
  tag?: boolean | string
  /**
   * Indicated whether to push the git commit and tag.
   * 
   * Defaults to `false`
   */
  sign?: boolean
  /**
   * Sign the git commit and tag with a configured key(GPG/SSH) 
   * 
   * Defaults to `false`
   */
  push?: boolean
  /**
   * Indicated whether the git commit should include all files (`git commit --all`)
   * rather than just the files that were modified by `versionBump()`
   * 
   * 
   * Defaults to `false``
   */
  all?: boolean
  /**
   * Indicated whether to bypass git commit hooks (`git commit --no-verify`)
   * 
   * Defaults to `false`
   */
  noVerify?: boolean
  /**
   * Indicates whether to ignore version scripts.
   *
   * Defaults to `false`.
   */
  ignoreScripts?: boolean
  /**
   * The files to be updated. For certain known files ("package.json", "bower.json", etc)
   * `versionBump()` will explicitly update the file's version number. For other files
   * (README, config files, source code) it will simply do a global placement
   * of the old version number with the new version number
   * 
   * 
   * Defaults to   `['package.json', 'package-lock.json']` 
   */
  files?: string[]
  /**
   * The working directory, which is used as the basis for locating all files
   * 
   * Defaults to `process.cwd()`
   */
  cwd?: string
  /**
   * a callback that is provides info about the progress of the `versionBump()` function 
   */
  progress?(progress: VersionBumpProgress): void
  /**
   * Options for the command-line interface.
   * Can be one of the following:
   * 
   * - `true` - To defaults to `process.stdin` and `process.stdout`
   * - `false` - To disable all CLI output. Cannot be used when `release` is "prompt"
   * - An object that will be passed to `readline.createInterface()`
   * 
   * Defaults to `true`
   */
  interface?: boolean | InterfaceOptions
}

/**
 * Options for the command-line interface
 */

export interface InterfaceOptions {
  /**
   * THe stream that will be used to read user input. 
   * Can be one of the following:
   * 
   * - `true` - To default to `process.stdin`
   * - `false` - To disable all CLI input
   * -  Any readable stream
   */
  input?: NodeJS.ReadableStream | NodeJS.ReadStream | boolean

  /**
   * The stream that will be used to write output, 
   * such as prompts and progress
   * 
   * - `true` - To default to `process.stdout`
   * - `false` - To disable all CLI output
   * - Any writable stream
   */
  output?: NodeJS.WritableStream | NodeJS.WriteStream | boolean
  /**
   * Any other props will be passed directly to the `readline,createInterface()`
   * See the `ReadLineOptions` interface for possible options
   */
  [key: string]: unknown
}



// files without an import declaration, export, or top-level await should be considered a script and not a module.