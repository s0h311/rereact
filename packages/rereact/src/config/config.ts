import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import type { ReReactConfig } from './types.ts'

export const configFileName = 'rereact.config.ts'

export async function getConfig(): Promise<ReReactConfig> {
  const appRoot = getAppRoot()

  const configFilePath = `${appRoot}/${configFileName}`

  const config: ReReactConfig = await import(configFilePath).then((m) => m.default)

  return config
}

function getAppRoot(): string {
  let appRoot = process.cwd()

  while (!existsSync(resolve(appRoot, configFileName))) {
    if (resolve(appRoot) === '/') {
      throw new Error('[ReReact] Unable to find app root. Ensure you have a rereact.config.ts file.')
    }

    appRoot += '/..'
  }

  return resolve(appRoot)
}
