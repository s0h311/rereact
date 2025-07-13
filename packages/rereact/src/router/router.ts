import type { ReactElement } from 'react'
import type { Routes } from './types.ts'
import type { ReReactConfigInternal } from '../config/types.ts'
import { globSync } from 'node:fs'
import { basename } from 'node:path'
import RouterComponent from './RouterComponent.ts'

// TODO implement router
export async function getRouter(config: ReReactConfigInternal): Promise<ReactElement> {
  const routes = resolveRoutes(config)

  return RouterComponent(routes)
}

export function resolveRoutes(config: ReReactConfigInternal): Routes {
  const pagePaths = getPagePaths(config)

  const routes: Routes = {}

  pagePaths.forEach((filePath) => {
    const fileName = basename(filePath, '.tsx')

    let urlPath = `/${fileName}`

    if (fileName === 'index') {
      urlPath = '/'
    }

    routes[urlPath] = filePath
  })

  return routes
}

export function getPagePaths(config: ReReactConfigInternal): string[] {
  const pagesGlob = `${config.appRootPath}/app/pages/*`

  return globSync(pagesGlob)
}
