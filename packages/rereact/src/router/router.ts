import type { ReReactConfigInternal } from '../config/types.ts'
import { globSync } from 'node:fs'

export function getPagePaths(config: ReReactConfigInternal): string[] {
  const pagesGlob = `${config.appRootPath}/app/pages/*`

  return globSync(pagesGlob)
}
