import { createElement, type ReactElement } from 'react'
import type { RoutesInternal } from './types.ts'
import type { ReReactConfigInternal } from '../config/types.ts'
import { globSync } from 'node:fs'
import { basename } from 'node:path'

// TODO implement router
export async function getRouter(config: ReReactConfigInternal, routes: RoutesInternal): Promise<ReactElement> {
  return createElement('div')
}

export function resolveRoutes(config: ReReactConfigInternal): RoutesInternal {
  const pagePaths = getPagePaths(config)

  const routes: RoutesInternal = {}

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
