import { getConfig } from '../config/config.ts'
import type { ReReactConfigInternal } from '../config/types.ts'
import { Window } from 'happy-dom'
import { rolldown } from 'rolldown'
import { getPagePaths, getRouter } from '../router/router.ts'
import { rmSync } from 'node:fs'
import type { Routes } from '../router/types.ts'
import { basename, dirname } from 'node:path'

const DEFAULT_HEAD_TITLE = 'ReReact App :)'
const DEFAULT_HTML_LANG = 'en'
const DEFAULT_HEAD_CHARSET = 'utf-8'

const REACT_ROOT_ELEMENT_ID = 'app'

const ROLLDOWN_DEFAULT_CHUNK_PATTERN = '[name]-[hash].js'
const PAGE_CHUNK_PATTERN = 'page-[name]-[hash].js'

export async function buildApp(): Promise<void> {
  const config = await getConfig()

  const routes = await bundle(config)

  // TODO now that the routes are mapped to output chunks generate router dynamically for client side rendering
  const router = getRouter(config, routes)

  // TODO create main.js and bunle it and import it in index.html
  const indexHtmlContent = getIndexHtml(config)
}

async function bundle(config: ReReactConfigInternal): Promise<Routes> {
  // TODO maybe it's just enough to use the router as input and not all the pages
  const pagePaths = getPagePaths(config)

  const outputDir = `${config.appRootPath}/dist`

  rmSync(outputDir, { force: true, recursive: true })

  const bundle = await rolldown({
    input: pagePaths, // TODO also include here the root component from getReactRootComponent
    platform: 'browser',
    treeshake: true,
    jsx: 'react-jsx',
  })

  const { output } = await bundle.write({
    dir: outputDir,
    format: 'esm',
    minify: true,
    sourcemap: config.output?.sourcemap ?? false,
    entryFileNames: ({ moduleIds }) => {
      const isPage = moduleIds.find((moduleId) => {
        return basename(dirname(moduleId)) === 'pages'
      })

      if (isPage) {
        return PAGE_CHUNK_PATTERN
      }

      return ROLLDOWN_DEFAULT_CHUNK_PATTERN
    },
  })

  const routes: Routes = {}

  output.forEach((chunk) => {
    if (chunk.name && chunk.fileName.includes('page-')) {
      routes[chunk.name] = chunk.fileName
    }
  })

  return routes
}

function getIndexHtml(config: ReReactConfigInternal): string {
  const window = new Window()

  const document = window.document

  // Append element for react to render in

  const mainElement = document.createElement('main')
  mainElement.id = REACT_ROOT_ELEMENT_ID

  document.body.appendChild(mainElement)

  // Head

  const { head } = config

  document.head.title = head?.title ?? DEFAULT_HEAD_TITLE
  document.documentElement.setAttribute('lang', head?.lang ?? DEFAULT_HTML_LANG)

  const charsetMetaTag = document.createElement('meta')
  charsetMetaTag.setAttribute('charset', head?.charset ?? DEFAULT_HEAD_CHARSET)
  document.head.appendChild(charsetMetaTag)

  return document.documentElement.outerHTML
}
