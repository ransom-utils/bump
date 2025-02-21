
import { x } from 'tinyexec'
import { ProgressEvent } from './types/version-bump-progress'
import { Operation } from "./operation";

const run = (bin, argv, opts = {}) => {
  x(bin, argv, { throwOnError: true, ...opts })
}
/**
 * Commits the modififed files to Git, if the `commit` option is enabled.
 */


export async function gitCommit(operation: Operation): Promise<Operation> {
  if (!operation.options.commit) {
    return operation
  }

  const { all, noVerify, message } = operation.options.commit


  const { updatedFiles, newVersion } = operation.state

  let args: string[] = []

  if (all) {
    args.push('--all')
  }

  if (noVerify) {
    args.push('--no-verify')
  }


  const commitMessage = formatVersionString(message, newVersion)

  args.push('--message', commitMessage)

  if (!all) {
    args = args.concat(updatedFiles)
  }
  await run('git', ['add', ...updatedFiles])
  await run('git', ['commit', ...args])
  return operation.update({ event: ProgressEvent.GitCommit, commitMessage });
}


/**
 * Tags the Git commit, if the `tag` option is enabled.
 */

export async function gitTag(operation) {
  if (!operation.options.tag) {
    return operation
  }

  const { commit, tag } = operation.options

  const { newVersion } = operation.state

  const args = ['--annotate', '--message', formatVersionString(commit.message, newVersion)]

  const tagName = formatVersionString(tag.name, newVersion)

  args.push(tagName)
  await run('git', ['tag', ...args])
  return operation.update({ event: ProgressEvent.GitTag, tagName })
}


export async function gitPush(operation) {
  if (!operation.options.push) {
    return operation;
  }
  await run('git', 'push')
  if (operation.options.tag) {
    await run('git', ['push', '--tags'])
  }

}




function formatVersionString(template, newVersion) {

  if (template.includes('%s')) {
    return template.replace('%s', newVersion)
  } else {
    return template + newVersion
  }
}