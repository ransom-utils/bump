/**
 * ts equivalent
 * val transform process
 * op flow process
 * use case handle
 */

import { manifest } from '../manifest';
import cac from 'cac'


export function loadCliArgs(argv = process.argv) {
  const cli = cac('bump')

  cli
    .version(manifest.version)
    .usage('[...files]')
    .option('--preid <name>', 'The identifier for prerelease versions.', { default: 'beta' })
    .option('-c, --commit <message>', 'Commit changed files to Git.', { default: true })
    .option('--no-commit', 'skip commit', { default: false })
    .option('-t, --tag <tag>', 'Tag name', { default: true })
    .option('--no-tag', 'skip tag', { default: false })
    .option('--sign', 'sign commit and tag')
    .option('--no-verify', 'Skip git verification')
    .option('--ignore-scripts', 'Bypass version script')
    .option('-q --quiet', 'suppress output')
    .help()

  const result = cli.parse(argv)
  const rawArgs = cli.rawArgs
  const args = result.options


  const COMMIT_REG = /(?:-c|--commit|--no-commit)(?:=.*|$)/
  const TAG_REG = /(?:-t|--tag|--no-tag)(?:=.*|$)/
  const hasCommitFlag = rawArgs.some(arg => COMMIT_REG.test(arg))
  const hasTagFlag = rawArgs.some(arg => TAG_REG.test(arg))




  const { tag, commit, ...rest } = args

  return {
    args: {
      ...rest,
      commit: hasCommitFlag ? commit : undefined,
      tag: hasTagFlag ? tag : undefined,
    } as { [k: string]: any },
    resultArgs: result.args,
  }
}


export const usageText = `
Usage: bump [release] [options] [files...]

release:
  The release version or type.  Can be one of the following:
   - A semver version number (ex: 1.23.456)
   - prompt: Prompt for the version number (this is the default)
   - major: Increase major version
   - minor: Increase minor version
   - patch: Increase patch version
   - premajor: Increase major version, pre-release
   - preminor: Increase preminor version, pre-release
   - prepatch: Increase prepatch version, pre-release
   - prerelease: Increase prerelease version

options:
  --preid <name>            The identifier for prerelease versions.
                            Defaults to "beta".

  -c, --commit [message]    Commit changed files to Git.
                            Defaults to "release vX.X.X".

  -t, --tag [tag]           Tag the commit in Git.
                            The Default tag is "vX.X.X"

  -p, --push                Push the Git commit.

  -a, --all                 Commit/tag/push ALL pending files,
                            not just the ones that were bumped.
                            (same as "git commit -a")

  --no-verify               Bypass Git commit hooks
                            (same as "git commit --no-verify")

  -v, --version             Show the version number

  -q, --quiet              Suppress unnecessary output

  -h, --help               Show usage information

  --ignore-scripts         Bypass version scripts

...files
  One or more files and/or globs to bump (ex: README.md *.txt docs/**/*).
  Defaults to package.json and package-lock.json.

Examples:

  bump patch

    Bumps the patch version number in package.json and package-lock.json.
    Nothing is committed to git.

  bump major --commit

    Bumps the major version number in package.json and package-lock.json.
    Commits package.json and package-lock.json to git, but does not tag the commit.

  bump -tpa README.md

    Prompts for the new version number and updates package.json, package-lock.json, and README.md.
    Commits ALL modified files to git, tags the commit, and pushes the commit.

  bump 4.27.9934 --tag "Version " bower.json docs/**/*.md

    Sets the version number to 4.27.9934 in package.json, package-lock.json, bower.json,
    and all markdown files in the "docs" directory.  Commits the updated files to git,
    and tags the commit as "Version 4.27.9934".
` as const;


export const helpText = `
${manifest.name} - ${manifest.description}
${usageText}` as const;