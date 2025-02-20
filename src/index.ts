import { versionBump } from "./version-bump";

export * from './config'
export { type ReleaseType } from "./release-type";
export * from "./types/version-bump-options";
export * from "./types/version-bump-results";
export * from "./types/version-bump-progress";


// Export `versionBump` as a named export and the default export
export { versionBump };
export default versionBump;

// CommonJS default export hack
// if (typeof module === "object" && (typeof module.exports === "object" || typeof module.exports === "function")) {
//   module.exports = Object.assign(module.exports.default, module.exports);
// }