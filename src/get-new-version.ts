import { Operation } from './operation'
import semver from 'semver'
import { isPrereleaseType, type ReleaseType, releaseTypes } from './release-type'
import inquirer from 'inquirer'
import { type BumpRelease } from './normalize-options'
/**
 * Determine t he new version number, possibly by prompting the user for it
 */

export async function getNewVersion(operation: Operation): Promise<Operation> {

  const { release } = operation.options
  const { currentVersion } = operation.state

  switch (release.type) {
    case "prompt":
      return promptForNewVersion(operation)
    case "version":
      const newSerVer = new semver.SemVer(release.version, true)
      return operation.update({
        newVersion: newSerVer.version
      })
    default:
      return operation.update({
        release: release.type,
        newVersion: getNextVersion(currentVersion, release)
      })
  }

}


function getNextVersion(currentVersion: string, bump: BumpRelease): string {
  const oldSemVer = new semver.SemVer(currentVersion)
  const newSemVer = oldSemVer.inc(bump.type, bump.preid)
  if (isPrereleaseType(bump.type) &&
    newSemVer.prerelease.length === 2 &&
    newSemVer.prerelease[0] === bump.preid &&
    String(newSemVer.prerelease[1]).startsWith('0')
  ) {
    // This is a special case when going from a non-prerelease version to a prerelease version.
    // SemVer sets the prerelease version to zero (e.g. "1.23.456" => "1.23.456-beta.0").
    // But the user probably expected it to be "1.23.456-beta.1" instead.
    newSemVer.prerelease[1] = "1"
    newSemVer.format()
  }
  return newSemVer.version
}


/**
 * Returns the next version number for all release types.
 */
function getNextVersions(currentVersion: string, preid: string): Record<ReleaseType, string> {
  const next: Record<string, string> = {};
  for (const type of releaseTypes) {
    next[type] = getNextVersion(currentVersion, { type, preid })
  }
  return next
}


/** 
 * Prompts the user for the new version number
 * 
 * @returns - A tuple containing the new version number and the release type (if any)
 */

async function promptForNewVersion(operation: Operation) {
  const { currentVersion, currentVersionSource } = operation.state



  const release = operation.options.release
  const next = getNextVersions(currentVersion, 'preid' in release ? release.preid : undefined)

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "release",
      message: `\nThe current version in ${currentVersionSource} is ${currentVersion}\nHow would you like to bump it?`,
      default: "patch",
      pageSize: 10,
      choices: [
        { value: "major", name: `major (${next.major})` },
        { value: "minor", name: `minor (${next.minor})` },
        { value: "patch", name: `patch (${next.patch})` },
        { value: "premajor", name: `pre-release major (${next.premajor})` },
        { value: "preminor", name: `pre-release minor (${next.preminor})` },
        { value: "prepatch", name: `pre-release patch (${next.prepatch})` },
        { value: "prerelease", name: `pre-release (${next.prerelease})` },
        new inquirer.Separator(),
        { value: "none", name: `leave as-is (${currentVersion})` },
        { value: "custom", name: "custom..." },
      ]
    },
    {
      type: "input",
      name: "newVersion",
      message: "Enter the new version number:",
      default: currentVersion,
      when: (previousAnswer) => previousAnswer.release === "custom",
      filter: semver.clean,
      validate: (newVersion) => {
        return semver.valid(newVersion) ? true : "That's not a valid version number";
      },
    }
  ])

  switch (answers.release) {
    case "none":
      return operation.update({ newVersion: currentVersion });
    case "custom":
      return operation.update({ newVersion: answers.newVersion });
    default:
      return operation.update({
        release: answers.release,
        newVersion: next[answers.release],
      });
  }
}

