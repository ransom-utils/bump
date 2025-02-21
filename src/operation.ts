import { type ReleaseType } from "./release-type";
import { type VersionBumpResult } from "./types/version-bump-results";
import { type NormalizedOptions } from "./normalize-options";
import { type VersionBumpOptions } from "./types/version-bump-options";
import { normalizeOptions } from "./normalize-options"
import { NpmScript, ProgressEvent, type VersionBumpProgress } from "./types/version-bump-progress";


interface OperationState {
  release: ReleaseType | undefined
  currentVersion: string
  currentVersionSource: string
  newVersion: string
  commitMessage: string
  tagName: string
  updatedFiles: string[]
  skippedFiles: string[]
}


interface UpdateOperationState extends Partial<OperationState> {
  event?: ProgressEvent
  script?: NpmScript
}


type ProgressCallback = (progress: VersionBumpProgress) => void

/**
 * All of the inputs, outputs and state of a single `versionBump()` call.
 */
export class Operation {
  /**
   * The options for this options
   */
  public options: NormalizedOptions;
  /**
   * The current state of the operation
   */
  public readonly state: Readonly<OperationState> = {
    release: undefined,
    currentVersion: '',
    currentVersionSource: '',
    newVersion: '',
    commitMessage: '',
    tagName: '',
    updatedFiles: [],
    skippedFiles: []
  };

  /**
 * The results of the operation
*/
  public get results(): VersionBumpResult {
    let options = this.options
    let state = this.state
    return {
      release: state.release,
      currentVersion: state.currentVersion,
      newVersion: state.newVersion,
      commit: options.commit ? state.commitMessage : false,
      tag: options.tag ? state.tagName : false,
      updatedFiles: state.updatedFiles.slice(),
      skippedFiles: state.skippedFiles.slice()
    }
  }

  /**
   * The callback that's used to report the progress of the operation
   */
  private readonly _progress?: ProgressCallback
  /**
   * Private constructor. Use the `Operation.start()` static method instead
   */
  private constructor(options: NormalizedOptions, progress?: ProgressCallback) {

    this.options = options
    this._progress = progress
  }


  /**
   * Starts a new `versionBump()` operation
   */
  public static async start(input: VersionBumpOptions): Promise<Operation> {
    // validate and normalize the options
    const options = await normalizeOptions(input)
    // console.log("parsed-options %s", JSON.stringify(options, null, 2));
    return new Operation(options, input.progress)
  }

  /**
   * Updates the operation state and results, and reports the updated progress to the user
   */
  public update({ event, script, ...newState }: UpdateOperationState): this {
    // update the operation state
    Object.assign(this.state, newState)

    if (event && this._progress) {
      // report the progress to user
      this._progress({ event, script, ...this.results })
    }
    return this
  };
}


