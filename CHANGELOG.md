Change Log
====================================================================================================



- Dropped support for Node v0.x
- Added support for [npm version scripts](https://docs.npmjs.com/cli/version).
  - The `preversion` script runs before the version is updated (and before the version prompt is shown)
  - The `version` script runs after the version is updated, but _before_ `git commit` and `git tag`
  - The `postversion` script runs after `git commit` and `git tag`, but _before_ `git push`

[Full Changelog](https://github.com/ransom/debug/compare/v1.0.0...v0.0.1)


[v1.0.0](https://github.com/ransom/debug/tree/v2.0.0) (2025-01-12)

--------------------------------------------------------------------------------------------------