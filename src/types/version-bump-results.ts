
import { type ReleaseType } from '../release-type'
export interface VersionBumpResult {
  /**
   * The release type that was used, 
   * or `undefined` if an explicit version number was used
   */
  release?: ReleaseType
  /**
   * The previous version
   */
  currentVersion: string
  /**
   * The new version
   */
  newVersion: string
  /**
   * The commit message that was used for the git commit,
   * or `false` if no commit was created
   * NOTE: This will never be an empty string. It wll at least contain at lease the new version 
   */
  commit: string | false
  /**
   * The tag name that was used for the git tag, 
   * or `false` if no tag was created
   * NOTE: This will never be an empty string. It wll at least contain at lease the new version 
   *
   */
  tag: string | false
  /**
   * The files that were actually modified
   */
  updatedFiles: string[]
  /**
   * The files that were not updated because they did not contain the old version number
   */
  skippedFiles: string[]
}