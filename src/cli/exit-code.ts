/**
 * CLI exit codes
 */

export enum ExitCode {
  Success = 0,
  FatalError = 1,
  InvalidArgument = 9
}


// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.ExitCode = void 0;
// /**
//  * CLI exit codes.
//  *
//  * @see https://nodejs.org/api/process.html#process_exit_codes
//  */
// var ExitCode;
// (function (ExitCode) {
//   ExitCode[(ExitCode["Success"] = 0)] = "Success";
//   ExitCode[(ExitCode["FatalError"] = 1)] = "FatalError";
//   ExitCode[(ExitCode["InvalidArgument"] = 9)] = "InvalidArgument";
// })((ExitCode = exports.ExitCode || (exports.ExitCode = {})));
