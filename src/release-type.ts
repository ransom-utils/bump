/**
 * The different types of pre-releases.
 */
export const prereleaseTypes = ['premajor', 'preminor', 'prepatch', 'prerelease'] as const

/**
 * All possible release types.
 */

export const releaseTypes = [...prereleaseTypes, 'major', 'minor', 'patch'] as const


// const releaseTypes = prereleaseTypes.concat(['major', 'minor', 'patch'] as const)


export type ReleaseType = typeof releaseTypes[number];
export type PrereleaseType = typeof prereleaseTypes[number]


export function isPrereleaseType(value: any): boolean {
  return prereleaseTypes.includes(value)
}
export function isReleaseType(value: any): value is ReleaseType {
  return releaseTypes.includes(value)
}




