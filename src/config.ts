import escalade from "escalade/sync";
import type { VersionBumpOptions } from "./types/version-bump-options";
import { loadConfig } from "c12";
import { dirname } from 'node:path'

export const bumpConfigDefaults: VersionBumpOptions = {
  commit: true,
  tag: true,
  sign: false,
  noVerify: false,
  ignoreScripts: false,
  all: false,
  files: []
}

export async function loadBumpConfig(
  overrides?: Partial<VersionBumpOptions>,
  cwd = process.cwd()
) {
  const name = 'bump'
  const configFile = findConfigFile(name, cwd)

  const { config } = await loadConfig<VersionBumpOptions>({
    name,
    defaults: bumpConfigDefaults,
    overrides: {
      ...(overrides as VersionBumpOptions),
    },
    cwd: configFile ? dirname(configFile) : cwd
  })
  return config
}



function findConfigFile(name: string, cwd: string) {
  let foundRepoRoot = false
  try {
    const candidates = ['js', 'mjs', 'ts', 'mts', 'json'].map(ext => `${name}.config.${ext}`)
    return escalade(cwd, (_dir, names) => {
      const found = names.find(name => {
        if (candidates.includes(name)) {
          return true
        }
        if (name === '.git') {
          foundRepoRoot = true
        }
        return false
      })

      if (found)
        return found
      // stop at repo root
      if (foundRepoRoot) {
        throw null
      }
      return false
    })
  } catch (err) {
    if (foundRepoRoot)
      return null
    throw err
  }
}





export function defineConfig(config: Partial<VersionBumpOptions>) {
  return config
}