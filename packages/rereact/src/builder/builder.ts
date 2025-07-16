import { getConfig } from '../config/config.ts'
import type { ReReactConfigInternal } from '../config/types.ts'
import { Window } from 'happy-dom'
import { rolldown } from 'rolldown'
import { getPagePaths } from '../router/router.ts'
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname } from 'node:path'
import { logAndThrow } from '../utils/logger.ts'

const DEFAULT_HEAD_TITLE = 'ReReact App :)'
const DEFAULT_HTML_LANG = 'en'
const DEFAULT_HEAD_CHARSET = 'utf-8'

const REACT_ROOT_ELEMENT_ID = 'app'

const ROLLDOWN_DEFAULT_CHUNK_PATTERN = '[name]-[hash].js'
const PAGE_CHUNK_PATTERN = 'page-[name]-[hash].js'

export async function buildApp(): Promise<void> {
  const config = await getConfig()

  createReReactDir(config)
  copyRouter(config)
  createMainTs(config)

  const mainChunkName = await bundle(config)

  // TODO now that the routes are mapped to output chunks generate router dynamically for client side rendering
  // const router = getRouter(config, routes)

  // TODO create main.js and bunle it and import it in index.html
  const indexHtmlContent = getIndexHtml(config, mainChunkName)

  const indexHtmlOutputPath = `${config.bundleOutputDir}/index.html`
  writeFileSync(indexHtmlOutputPath, indexHtmlContent, { encoding: 'utf-8' })
}

async function bundle(config: ReReactConfigInternal): Promise<string> {
  // TODO maybe it's just enough to use the router as input and not all the pages

  const entryPoints = [...getPagePaths(config), `${config.reReactDir}/main.tsx`]

  rmSync(config.bundleOutputDir, { force: true, recursive: true })

  const bundle = await rolldown({
    input: entryPoints, // TODO also include here the root component from getReactRootComponent
    platform: 'browser',
    treeshake: true,
    jsx: 'react-jsx',
  })

  const { output } = await bundle.write({
    dir: config.bundleOutputDir,
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

  const mainChunk = output.find(({ name }) => name === 'main')

  if (!mainChunk) {
    logAndThrow('Cannot find router chunk')
  }

  return mainChunk.fileName
}

function getIndexHtml(config: ReReactConfigInternal, mainChunkName: string): string {
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

  // START main.js

  const mainScript = document.createElement('script')

  mainScript.setAttribute('type', 'module')
  mainScript.src = `./${mainChunkName}`
  // END main.js

  document.head.appendChild(mainScript)

  return document.documentElement.outerHTML
}

function createReReactDir(config: ReReactConfigInternal): void {
  rmSync(config.reReactDir, { force: true, recursive: true })

  mkdirSync(config.reReactDir)
}

function copyRouter(config: ReReactConfigInternal): void {
  const routerPath = `${import.meta.dirname}/../router/Router.tsx`

  const targetPath = `${config.reReactDir}/Router.tsx`

  copyFileSync(routerPath, targetPath)
}

function createMainTs(config: ReReactConfigInternal): void {
  const mainTsxCode = `import Router from './Router.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('app')!).render(StrictMode({ children: Router() }));`

  const mainTsxOutputPath = `${config.reReactDir}/main.tsx`
  writeFileSync(mainTsxOutputPath, mainTsxCode, { encoding: 'utf-8' })
}
